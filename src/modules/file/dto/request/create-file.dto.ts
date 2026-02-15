import { ApiProperty } from '@nestjs/swagger';

export class CreateFileDto {
  @ApiProperty({
    type: 'string',
    format: 'binary',
  })
  picture: any;
}

export class CreateFilesDto {
  @ApiProperty({
    type: 'array',
    items: {
      type: 'string',
      format: 'binary',
    },
  })
  pictures: any[];
}
