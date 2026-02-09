import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsNotEmpty, IsOptional } from 'class-validator';

export class CreateFileDto {
  @ApiProperty({
    type: 'file',
    format: 'binary',
  })
  @IsNotEmpty()
  picture: Express.Multer.File;
}
