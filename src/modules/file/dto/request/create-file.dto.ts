import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsNotEmpty, IsOptional } from 'class-validator';

export class CreateFileDto {
  @ApiProperty({
    type: 'file',
    format: 'binary',
  })
  picture: Express.Multer.File;
}

export class CreateFilesDto {
  @ApiProperty({
    type: 'array',
    items: {
      type: 'string',
      format: 'binary',
    },
  })
  pictures: Express.Multer.File[];
}
