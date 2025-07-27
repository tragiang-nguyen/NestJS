import { Injectable, HttpException, HttpStatus } from '@nestjs/common';
import { HttpService } from '@nestjs/axios';
import { ConfigService } from '@nestjs/config';
import { firstValueFrom } from 'rxjs';
import { CreateContactDto } from './dto/create-contact.dto';
import { UpdateContactDto } from './dto/update-contact.dto';

@Injectable()
export class ContactsService {
  private readonly webhookUrl: string;

  constructor(
    private readonly httpService: HttpService,
    private readonly configService: ConfigService,
  ) {
    const webhookUrl = this.configService.get<string>('BITRIX24_WEBHOOK_URL');
    console.log('Webhook URL from ConfigService:', webhookUrl);
    if (!webhookUrl) {
      throw new HttpException('BITRIX24_WEBHOOK_URL is not defined or invalid in .env', HttpStatus.INTERNAL_SERVER_ERROR);
    }
    this.webhookUrl = webhookUrl;
  }

  async getAllContacts(): Promise<any> {
    const response = await firstValueFrom(
      this.httpService.get(`${this.webhookUrl}/crm.contact.list`, {
        params: { select: ['*', 'UF_*'] },
      }),
    );
    return response.data.result;
  }

  async getContactById(id: string): Promise<any> {
    console.log(`Fetching contact with ID: ${id}`);
    const response = await firstValueFrom(
      this.httpService.get(`${this.webhookUrl}/crm.contact.get`, {
        params: { id },
      }),
    );
    let contact = response.data.result;

    // Lấy giá trị PHONE mới nhất (dựa trên ID cao nhất)
    if (contact.PHONE && Array.isArray(contact.PHONE) && contact.PHONE.length > 0) {
      contact.PHONE = contact.PHONE.reduce((latest, current) =>
        latest.ID > current.ID ? latest : current
      );
    }

    console.log('Processed contact data:', contact);
    return contact;
  }

  async createContact(createContactDto: CreateContactDto): Promise<void> {
    if (!createContactDto.NAME) {
      throw new HttpException('The field Tên is required.', HttpStatus.BAD_REQUEST);
    }

    const contactData = {
      fields: {
        NAME: createContactDto.NAME,
        ADDRESS: createContactDto.ADDRESS,
        PHONE: [{ VALUE: createContactDto.PHONE, VALUE_TYPE: 'WORK' }],
        EMAIL: [{ VALUE: createContactDto.EMAIL, VALUE_TYPE: 'WORK' }],
        WEB: [{ VALUE: createContactDto.WEBSITE, VALUE_TYPE: 'WORK' }],
      },
    };

    try {
      const response = await firstValueFrom(
        this.httpService.post(`${this.webhookUrl}/crm.contact.add`, contactData),
      );
      const contactId = response.data.result;
      console.log('Contact created with ID:', contactId);

      if (createContactDto.BANK_NAME || createContactDto.BANK_ACCOUNT) {
        const requisiteData = {
          entityTypeId: 3, // Contact
          presetId: 1,    // Thêm presetId cho requisite ngân hàng (thử nghiệm)
          entityId: contactId,
          fields: {
            UF_BANK_NAME: createContactDto.BANK_NAME,
            UF_ACC_NUM: createContactDto.BANK_ACCOUNT,
          },
        };
        try {
          const requisiteResponse = await firstValueFrom(
            this.httpService.post(`${this.webhookUrl}/crm.requisite.add`, requisiteData),
          );
          console.log('Requisite added response:', requisiteResponse.data);
        } catch (requisiteError) {
          console.error('Error adding requisite:', requisiteError.response?.data || requisiteError.message);
          // Bỏ qua lỗi requisite để không làm gián đoạn tạo contact
        }
      }
    } catch (error) {
      console.error('Error creating contact:', error.response?.data || error.message);
      throw new HttpException(
        `Failed to create contact: ${error.response?.data?.error_description || error.message}`,
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  async updateContact(id: string, updateContactDto: UpdateContactDto): Promise<void> {
    if (!updateContactDto.NAME) {
      throw new HttpException('The field Tên is required.', HttpStatus.BAD_REQUEST);
    }

    console.log('Updating contact with ID:', id, 'Data:', updateContactDto);

    const contactData = {
      id,
      fields: {
        NAME: updateContactDto.NAME,
        ADDRESS: updateContactDto.ADDRESS,
        PHONE: updateContactDto.PHONE ? [{ VALUE: updateContactDto.PHONE, VALUE_TYPE: 'WORK' }] : [], // Chỉ giữ giá trị mới, xóa cũ
        EMAIL: updateContactDto.EMAIL ? [{ VALUE: updateContactDto.EMAIL, VALUE_TYPE: 'WORK' }] : [],
        WEB: updateContactDto.WEBSITE ? [{ VALUE: updateContactDto.WEBSITE, VALUE_TYPE: 'WORK' }] : [],
      },
    };

    try {
      const response = await firstValueFrom(
        this.httpService.post(`${this.webhookUrl}/crm.contact.update`, contactData),
      );
      console.log('Contact update response:', response.data);

      if (updateContactDto.BANK_NAME || updateContactDto.BANK_ACCOUNT) {
        const requisiteData = {
          entityTypeId: 3,
          presetId: 1, // Thêm presetId cho requisite ngân hàng
          entityId: id,
          fields: {
            UF_BANK_NAME: updateContactDto.BANK_NAME,
            UF_ACC_NUM: updateContactDto.BANK_ACCOUNT,
          },
        };
        try {
          const requisiteResponse = await firstValueFrom(
            this.httpService.post(`${this.webhookUrl}/crm.requisite.add`, requisiteData),
          );
          console.log('Requisite update response:', requisiteResponse.data);
        } catch (requisiteError) {
          console.error('Error updating requisite:', requisiteError.response?.data || requisiteError.message);
        }
      }
    } catch (error) {
      console.error('Error updating contact:', error.response?.data || error.message);
      throw new HttpException(
        `Failed to update contact: ${error.response?.data?.error_description || error.message}`,
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  async deleteContact(id: string): Promise<void> {
    await firstValueFrom(
      this.httpService.post(`${this.webhookUrl}/crm.contact.delete`, { id }),
    );
  }
}