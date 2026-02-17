import { ApiProperty } from '@nestjs/swagger';

export class WishlistResponseDto {
  @ApiProperty({
    description: 'Unique wishlist record ID',
  })
  id: string;

  @ApiProperty({
    description: 'Product ID saved in wishlist',
  })
  productId: string;

  @ApiProperty({
    description: 'Name of the product',
  })
  productName: string;

  @ApiProperty({
    description: 'Date the product was added to the wishlist',
  })
  createdAt: Date;
}
