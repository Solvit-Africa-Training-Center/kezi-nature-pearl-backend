import { PartialType } from '@nestjs/swagger';
import { CreatePaypackDto } from './create-paypack.dto';

export class UpdatePaypackDto extends PartialType(CreatePaypackDto) {}
