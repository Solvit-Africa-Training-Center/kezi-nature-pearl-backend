import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { FindManyOptions, FindOneOptions, Repository } from 'typeorm';
import { Item } from './entities/item.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { AddItemTocartDto } from './dto/request';
import { ProductService } from '../product/product.service';
import { Cart } from '../cart/entities/cart.entity';

@Injectable()
export class ItemService {
  constructor(
    @InjectRepository(Item)
    private readonly itemRepo: Repository<Item>,
    private readonly productService: ProductService,
  ) {}

  async createItem(dto: AddItemTocartDto, cart: Cart) {
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
      await this.itemRepo.update(existingItem.id, {
        quantity: existingItem.quantity,
      });
    } else {
      const item = this.itemRepo.create({
        cartId: cart.id,
        productId: product.id,
        quantity: dto.quantity,
        unitPrice: product.price,
      });
      await this.itemRepo.save(item);
    }

    // await this.cartService.updateCart(cart);

    return { message: 'Product added to cart' };
  }

  findAll(options?: FindManyOptions<Item>) {
    return this.itemRepo.find(options);
  }

  findOne(options: FindOneOptions<Item>) {
    return this.itemRepo.findOne(options);
  }

  async updateItem(id: string, quantity: number, cartId: string) {
    const item = await this.findOne({
      where: { id, cartId },
      relations: { product: true },
    });

    if (!item) throw new NotFoundException('Cart item not found');

    const { isProductAvailable, product } = await this.checkProductQuantity(
      item.productId,
      quantity,
    );

    if (!isProductAvailable)
      throw new BadRequestException('Insufficient Product stock');

    item.quantity = quantity;
    await this.itemRepo.update(id, item);
    return { message: 'CartItem Update' };
  }

  async deleteItem(id: string, cartId: string) {
    const item = await this.findOne({
      where: { id, cartId },
    });

    if (!item) throw new NotFoundException('Item not found');

    this.itemRepo.delete(id);

    return { message: 'Item removed from cart' };
  }

  async updateOrderItem(items: Item[], orderId: string) {
    for (const item of items) {
      const exist = await this.itemRepo.exists({ where: { id: item.id } });

      if (exist) this.itemRepo.update(item.id, { orderId });
    }

    return { message: 'Item Update' };
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
