import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { FindManyOptions, FindOneOptions, Repository } from 'typeorm';
import { CartItem } from './entities/cart-item.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { AddItemTocartDto, UpdateCartItemDto } from './dto/request';
import { CartService } from '../cart/cart.service';
import { ProductService } from '../product/product.service';
import { Cart } from '../cart/entities/cart.entity';

@Injectable()
export class CartItemService {
  constructor(
    @InjectRepository(CartItem)
    private readonly cartItemRepo: Repository<CartItem>,
    private readonly cartService: CartService,
    private readonly productService: ProductService,
  ) {}

  async addItemToCart(
    dto: AddItemTocartDto,
    owner: { userId?: string | null; guestId?: string | null },
  ) {
    const cart = await this.cartService.getUserCart(owner);

    const { isProductAvailable, product } = await this.checkProductQuantity(
      dto.productId,
      dto.quantity,
    );

    if (!isProductAvailable)
      throw new BadRequestException('Insufficient Product stock');

    let existingItem;
    if (cart.items && cart.items.length > 0)
      existingItem = cart.items.find((item) => item.productId === product.id);

    if (existingItem) {
      existingItem.quantity += dto.quantity;
      await this.cartItemRepo.update(existingItem.id, {
        quantity: existingItem.quantity,
      });
    } else {
      const item = this.cartItemRepo.create({
        cartId: cart.id,
        productId: product.id,
        quantity: dto.quantity,
        unitPrice: product.price,
      });
      await this.cartItemRepo.save(item);
    }

    // await this.cartService.updateCart(cart);

    return { message: 'Product added to cart' };
  }

  findAll(options?: FindManyOptions<CartItem>) {
    return this.cartItemRepo.find(options);
  }

  findOne(options: FindOneOptions<CartItem>) {
    return this.cartItemRepo.findOne(options);
  }

  async updateCartItem(
    id: string,
    quantity: number,
    owner: { userId?: string | null; guestId?: string | null },
  ) {
    const { userId, guestId } = owner;
    let cart: Cart | null = null;

    if (userId) {
      cart = await this.cartService.findOne({
        where: { userId },
        relations: { items: true },
      });
    } else if (guestId) {
      cart = await this.cartService.findOne({
        where: { guestId },
        relations: { items: true },
      });
    }

    if (!cart) throw new NotFoundException('Cart not found');

    const item = cart.items.find((item) => (item.id = id));

    if (!item) throw new NotFoundException('Cart item not found');

    const { isProductAvailable, product } = await this.checkProductQuantity(
      item.productId,
      quantity,
    );

    if (!isProductAvailable)
      throw new BadRequestException('Insufficient Product stock');

    item.quantity = quantity;
    return await this.cartItemRepo.update(id, item);
  }

  async deleteItem(
    id: string,
    owner: { userId?: string | null; guestId?: string | null },
  ) {
    const { userId, guestId } = owner;

    let cart: Cart | null = null;
    if (userId) {
      cart = await this.cartService.findOne({
        where: { userId },
        relations: { items: true },
      });
    } else if (guestId) {
      cart = await this.cartService.findOne({
        where: { guestId },
        relations: { items: true },
      });
    }

    if (!cart) throw new NotFoundException('User cart not found');

    const item = cart.items.find((item) => (item.id = id));

    if (!item) throw new NotFoundException('Item not found');

    this.cartItemRepo.delete(id);
    return { message: 'Item removed from cart' };
  }

  // helper
  async checkProductQuantity(productId: string, requestQuantity: number) {
    const product = await this.productService.findOne({
      where: { id: productId },
    });

    if (!product) throw new NotFoundException('Product not found');

    return {
      isProductAvailable: requestQuantity <= product.stockQuantity,
      product,
    };
  }
}
