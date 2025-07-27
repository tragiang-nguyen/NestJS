import { IsNotEmpty, IsString, IsOptional } from 'class-validator';

export class CreateContactDto {
  @IsNotEmpty({ message: 'The field Tên is required.' })
  @IsString()
  NAME: string;

  @IsOptional()
  @IsString()
  ADDRESS?: string;

  @IsOptional()
  @IsString()
  PHONE?: string;

  @IsOptional()
  @IsString()
  EMAIL?: string;

  @IsOptional()
  @IsString()
  WEBSITE?: string;

  @IsOptional()
  @IsString()
  BANK_NAME?: string;

  @IsOptional()
  @IsString()
  BANK_ACCOUNT?: string;
}