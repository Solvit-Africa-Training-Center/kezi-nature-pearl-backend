import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import {
  IsBoolean,
  IsOptional,
  IsString,
  ValidateNested,
} from 'class-validator';
import { CreateAddressDto } from 'src/modules/address/dto/request';
import { Type } from 'class-transformer';

export class CartCheckoutDto {
  @ApiProperty({ type: () => CreateAddressDto })
  @ValidateNested()
  @Type(() => CreateAddressDto)
  shippingAddressSnapshot: CreateAddressDto;

  @ApiPropertyOptional({ type: () => Boolean })
  @IsOptional()
  @IsBoolean()
  saveAddress: boolean;

  @ApiProperty()
  @IsString()
  phoneNumber: string;
}
