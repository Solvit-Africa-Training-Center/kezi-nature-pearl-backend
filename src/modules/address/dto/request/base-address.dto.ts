import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsBoolean, IsOptional, IsString } from 'class-validator';

export class AddressBaseRequestDto {
  @ApiProperty({ example: 'John Doe' })
  @IsString()
  fullName: string;

  @ApiProperty({ example: '+60123456789' })
  @IsString()
  phoneNumber: string;

  @ApiProperty({ example: 'country' })
  @IsString()
  country: string;

  @ApiProperty({ example: 'state' })
  @IsString()
  state: string;

  @ApiPropertyOptional({ example: 'city' })
  @IsOptional()
  @IsString()
  city: string;

  @ApiPropertyOptional({ example: 'province' })
  @IsOptional()
  @IsString()
  province: string;

  @ApiPropertyOptional({ example: 'district' })
  @IsOptional()
  @IsString()
  district: string;

  @ApiPropertyOptional({ example: 'sector' })
  @IsOptional()
  @IsString()
  sector: string;

  @ApiPropertyOptional({ example: 'No. 12, Jalan Bukit Bintang' })
  @IsOptional()
  @IsString()
  addressLine1: string;

  @ApiPropertyOptional({ example: '55100', required: false })
  @IsOptional()
  @IsString()
  postalCode?: string;

  @ApiPropertyOptional({ example: false, required: false })
  @IsOptional()
  @IsBoolean()
  isDefault?: boolean;
}
