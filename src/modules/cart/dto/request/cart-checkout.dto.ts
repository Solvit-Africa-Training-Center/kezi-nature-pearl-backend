import { ApiProperty } from '@nestjs/swagger';
import { IsString, ValidateNested } from 'class-validator';
import { CreateAddressDto } from 'src/modules/address/dto/request';
import { Type } from 'class-transformer';

export class CartCheckoutDto {
  @ApiProperty({ type: () => CreateAddressDto })
  @ValidateNested()
  @Type(() => CreateAddressDto)
  shippingAddressSnapshot: CreateAddressDto;

  @ApiProperty()
  @IsString()
  phoneNumber: string;
}
