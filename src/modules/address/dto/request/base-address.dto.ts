import { ApiProperty } from '@nestjs/swagger';
import { IsBoolean, IsEnum, IsOptional, IsString } from 'class-validator';
import { AddressType } from 'src/common/enums/user.enum';

export class AddressBaseRequestDto {
  @ApiProperty({ example: 'John Doe' })
  @IsString()
  fullName: string;

  @ApiProperty({ example: '+60123456789' })
  @IsString()
  phoneNumber: string;

  @ApiProperty({ example: 'No. 12, Jalan Bukit Bintang' })
  @IsString()
  addressLine1: string;

  @ApiProperty({ example: 'Unit 15-03', required: false })
  @IsOptional()
  @IsString()
  addressLine2?: string;

  @ApiProperty({ example: 'Kuala Lumpur' })
  @IsString()
  city: string;

  @ApiProperty({ example: 'WP Kuala Lumpur' })
  @IsString()
  state: string;

  @ApiProperty({ example: '55100', required: false })
  @IsOptional()
  @IsString()
  postalCode?: string;

  @ApiProperty({ example: 'MY' })
  @IsString()
  country: string;

  @ApiProperty({ enum: ['shipping', 'billing', 'both'], default: 'shipping' })
  @IsEnum(AddressType)
  type: AddressType;

  @ApiProperty({ example: false, required: false })
  @IsOptional()
  @IsBoolean()
  isDefault?: boolean;
}
