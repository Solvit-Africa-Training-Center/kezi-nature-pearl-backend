import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsEmail, IsEnum, IsOptional, IsString, IsUUID } from 'class-validator';
import { ContactUsStatus } from 'src/common/enums/product.enum';

export class FilterContactUsDto {
  @ApiPropertyOptional()
  @IsOptional()
  @IsUUID()
  id?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  name?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsEmail()
  email?: string;

  @ApiPropertyOptional({ enum: ContactUsStatus })
  @IsOptional()
  @IsEnum(ContactUsStatus)
  status?: ContactUsStatus;
}
