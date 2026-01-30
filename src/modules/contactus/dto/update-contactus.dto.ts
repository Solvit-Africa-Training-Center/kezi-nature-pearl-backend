import { PartialType } from '@nestjs/swagger';
import { CreateContactUsDto } from './create-contactus.dto';

export class UpdateContactusDto extends PartialType(CreateContactUsDto) {}
