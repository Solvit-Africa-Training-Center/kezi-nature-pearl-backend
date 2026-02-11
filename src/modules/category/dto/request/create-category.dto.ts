import { ApiProperty, ApiPropertyOptional, PartialType } from '@nestjs/swagger';
import { IsString, IsOptional, IsBoolean, IsNotEmpty } from 'class-validator';
import { CreateFileDto } from 'src/modules/file/dto/request';

export class CreateCategoryDto extends PartialType(CreateFileDto) {
  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  name: string;

  @ApiPropertyOptional()
  @IsNotEmpty()
  @IsOptional()
  @IsString()
  description?: string;
}
