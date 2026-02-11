import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsUUID } from 'class-validator';
import { CreateFileDto } from 'src/modules/file/dto/request';

export class CreateProductImageDto {
  @IsNotEmpty()
  @IsUUID()
  productId: string;

  @IsNotEmpty()
  files: Express.Multer.File[];
}
