import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsBoolean, IsNotEmpty, IsOptional, IsString } from 'class-validator';
import { CreateFileDto } from 'src/modules/file/dto/request';

export class CategoryRequestBaseDto extends CreateFileDto {
  @ApiProperty({ example: 'Soaps' })
  @IsNotEmpty()
  @IsString()
  name: string;

  @ApiPropertyOptional({ example: 'Soap Products' })
  @IsOptional()
  @IsString()
  description: string;

  @ApiProperty()
  @IsBoolean()
  isActive?: boolean;
}
