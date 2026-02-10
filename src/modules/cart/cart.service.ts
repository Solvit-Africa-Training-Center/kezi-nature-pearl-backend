import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateCartDto } from './dto/create-cart.dto';
import { UpdateCartDto } from './dto/update-cart.dto';
import { FindManyOptions, FindOneOptions, Repository } from 'typeorm';
import { Cart } from './entities/cart.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { CartItemService } from '../cart-item/cart-item.service';
import { ProductService } from '../product/product.service';
import { CartStatus } from 'src/common/enums/product.enum';
import { RemoveItemFromCartDto } from '../cart-item/dto/request/remove-item-from-cart.dto';

@Injectable()
export class CartService {
  constructor(
    @InjectRepository(Cart)
    private readonly cartRepo: Repository<Cart>,
    private readonly cartItemService: CartItemService,
    private readonly productService: ProductService,
  ) {}
  async create(dto: CreateCartDto, userId: string) {
    const userCartActive = await this.findOne({
      where: { userId, status: CartStatus.ACTIVE },
    });

    let cart = userCartActive;
    if (!cart) cart = await this.cartRepo.save({ userId });

    const product = await this.productService.findOne({
      where: { id: dto.productId },
    });

    if (!product) throw new NotFoundException('Product not found');

    const cartItem = await this.cartItemService.create({
      cartId: cart.id,
      productId: product.id,
      quantity: dto.quantity,
      unitPrice: product.price,
    });

    cart.items?.push(cartItem);

    await this.cartRepo.save(cart);
    return { message: 'Product added to cart' };
  }

  async findOne(options: FindOneOptions<Cart>) {
    return await this.cartRepo.findOne(options);
  }

  async removeItem(dto: RemoveItemFromCartDto, userId: string) {
    const cart = await this.findOne({
      where: { userId },
      relations: { items: true },
    });

    if (!cart) throw new NotFoundException('User has no cart');

    if (!cart.items || cart.items.length <= 0)
      throw new NotFoundException('Cart has no items');

    for (const item of dto.items) {
      await this.cartItemService.delete(item);
    }

    return { message: 'Item  Removed' };
  }

  async remove(id: string) {
    return await this.cartRepo.delete(id);
  }
}
