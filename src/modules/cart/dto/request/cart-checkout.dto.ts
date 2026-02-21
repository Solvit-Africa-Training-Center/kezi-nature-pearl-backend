import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import {
  IsBoolean,
  IsOptional,
  IsString,
  IsUUID,
  ValidateNested,
} from 'class-validator';
import { CreateAddressDto } from 'src/modules/address/dto/request';
import { Type } from 'class-transformer';
import { Optional } from '@nestjs/common';

export class CartCheckoutDto {
  @ApiProperty({ type: () => CreateAddressDto })
  @ValidateNested()
  @Type(() => CreateAddressDto)
  shippingAddressSnapshot: CreateAddressDto;

  @ApiPropertyOptional({ type: () => Boolean })
  @IsOptional()
  @IsBoolean()
  saveAddress: boolean = false;

  @ApiPropertyOptional()
  @IsOptional()
  @IsUUID('4', { message: 'AddressId must be a valid UUID' })
  addressId: string;

  @ApiProperty({ required: true })
  @IsString()
  phoneNumber: string;
}
