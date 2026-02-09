import { PartialType } from '@nestjs/swagger';
import { CreateFileDto } from './request/create-file.dto';

export class UpdateFileDto extends PartialType(CreateFileDto) {}
