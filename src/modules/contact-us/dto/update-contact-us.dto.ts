import { PartialType } from '@nestjs/swagger';
import { IsEnum, IsOptional, IsString } from 'class-validator';
import { ContactUsStatus } from '../../../common/enums/product.enum';
import { CreateContactUsDto } from './create-contact-us.dto';

export class UpdateContactUsDto extends PartialType(CreateContactUsDto) {
  @IsOptional()
  @IsEnum(ContactUsStatus)
  status?: ContactUsStatus;

  @IsOptional()
  @IsString()
  response?: string;

  @IsOptional()
  @IsString()
  respondedBy?: string;
}
