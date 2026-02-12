import { ApiProperty } from '@nestjs/swagger';

export class CreateFileDto {
  @ApiProperty({
    type: 'file',
    format: 'binary',
  })
  picture?: Express.Multer.File;
}

export class CreateFilesDto {
  @ApiProperty({
    type: 'array',
    items: {
      type: 'string',
      format: 'binary',
    },
  })
  // @IsNotEmpty()
  pictures: Express.Multer.File[];
}
