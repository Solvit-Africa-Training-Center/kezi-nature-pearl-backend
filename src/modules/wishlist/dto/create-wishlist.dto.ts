import { IsUUID, IsNotEmpty } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateWishlistDto {
  @ApiProperty({
    description: 'ID of the product to be added to the wishlist',
  })
  @IsUUID()
  @IsNotEmpty()
  productId: string;
}
