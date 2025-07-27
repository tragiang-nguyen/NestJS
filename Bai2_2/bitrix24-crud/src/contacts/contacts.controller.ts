import { Controller, Get, Post, Body, Param, Delete, Render, Redirect } from '@nestjs/common';
import { ContactsService } from './contacts.service';
import { CreateContactDto } from './dto/create-contact.dto';
import { UpdateContactDto } from './dto/update-contact.dto';

@Controller('contacts')
export class ContactsController {
  constructor(private readonly contactsService: ContactsService) {}

  @Get()
  @Render('contacts/index')
  async findAll() {
    const contacts = await this.contactsService.getAllContacts();
    return { contacts };
  }

  @Get('add')
  @Render('contacts/add')
  addForm() {
    return {};
  }

  @Post()
  @Redirect('/contacts')
  async create(@Body() createContactDto: CreateContactDto) {
    await this.contactsService.createContact(createContactDto);
  }

  @Get(':id/edit')
  @Render('contacts/edit')
  async editForm(@Param('id') id: string) {
    const contact = await this.contactsService.getContactById(id);
    return { contact};
  }

  @Post(':id')
  @Redirect('/contacts')
  async update(@Param('id') id: string, @Body() updateContactDto: UpdateContactDto) {
    await this.contactsService.updateContact(id, updateContactDto);
  }

  @Post(':id/delete')
  @Redirect('/contacts')
  async delete(@Param('id') id: string) {
    await this.contactsService.deleteContact(id);
  }

  @Post('bitrix/Reinstall')
  async handleWebhook(@Body() body: any) {
    console.log('Received webhook from Bitrix24:', body);
    if (body.event === 'ONCRMCONTACTADD') {
      console.log('New contact added:', body.data.FIELDS);
    } else if (body.event === 'ONCRMCONTACTUPDATE') {
      console.log('Contact updated:', body.data.FIELDS);
    } else if (body.event === 'ONCRMCONTACTDELETE') {
      console.log('Contact deleted:', body.data.ID);
    }
    return { status: 'ok' };
  }
}