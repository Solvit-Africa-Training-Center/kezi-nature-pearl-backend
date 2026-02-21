import { ProductResponseDto } from 'src/modules/product/dto/response/product-response.dto';
import { Wishlist } from '../../entities/wishlist.entity';

export class WishlistResponseDto {
  id: string;
  product: ProductResponseDto;

  constructor(wishlist: Wishlist) {
    this.id = wishlist.id;
    this.product = new ProductResponseDto(wishlist.product);
  }
}
