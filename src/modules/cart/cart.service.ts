import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { CreateCartDto } from './dto/request/create-cart.dto';
import { DataSource, FindOneOptions, Repository } from 'typeorm';
import { Cart } from './entities/cart.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { CartItemService } from '../cart-item/cart-item.service';
import { ProductService } from '../product/product.service';
import { CartStatus } from 'src/common/enums/product.enum';
import { RemoveItemFromCartDto } from '../cart-item/dto/request/remove-item-from-cart.dto';
import { OrderService } from '../order/order.service';

@Injectable()
export class CartService {
  constructor(
    @InjectRepository(Cart)
    private readonly cartRepo: Repository<Cart>,
    private readonly dataSource: DataSource,
    private readonly cartItemService: CartItemService,
    private readonly productService: ProductService,
    private readonly orderService: OrderService,
  ) {}
  async addToCart(dto: CreateCartDto, userId: string) {
    const product = await this.productService.findOne({
      where: { id: dto.productId },
    });

    if (!product) throw new NotFoundException('Product not found');

    if (dto.quantity > product.stockQuantity)
      throw new BadRequestException(
        'Requested quantity exceeds available stock',
      );

    const userCartActive = await this.findOne({
      where: { userId, status: CartStatus.ACTIVE },
    });

    let cart = userCartActive;
    if (!cart) cart = await this.cartRepo.save({ userId });

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

  async checkout(userId: string) {
    try {
      await this.dataSource.transaction(async (manager) => {
        const cart =
          (await this.findOne({
            where: { userId, status: CartStatus.ACTIVE },
            relations: { items: true },
          })) ?? (await manager.save(Cart, { userId }));

        if (!cart || !cart.items) throw new NotFoundException('Cart not found');

        for (const cartItem of cart.items) {
          const product = await this.productService.findOne({
            where: { id: cartItem.productId },
          });

          if (!product) throw new NotFoundException(`Item not found`);
          if (product.stockQuantity < cartItem.quantity)
            throw new BadRequestException(
              `Product ${product.name} out of stock`,
            );

          await this.productService.update(product.id, product);
        }
        await this.orderService.create({ userId, items: cart.items });
        // this.cartRepo.update({ id: cart.id }, { status: CartStatus.CONVERTED });

        return { message: 'Checkout succesful' };
      });
    } catch (error) {
      console.log(error);
    }
  }

  async findOne(options: FindOneOptions<Cart>) {
    return await this.cartRepo.findOne(options);
  }

  async removeItem(dto: RemoveItemFromCartDto, userId: string) {
    const cart = await this.findOne({
      where: { userId, status: CartStatus.ACTIVE },
      relations: { items: true },
    });

    if (!cart) throw new NotFoundException('User has no cart');

    if (!cart.items || cart.items.length <= 0)
      throw new NotFoundException('Cart has no items');

    for (const item of dto.items) {
      const cartItem = await this.cartItemService.findOne({
        where: { id: item },
      });
      if (!cartItem) continue;

      await this.cartItemService.delete(item);
    }

    return { message: 'Item  Removed' };
  }
}
