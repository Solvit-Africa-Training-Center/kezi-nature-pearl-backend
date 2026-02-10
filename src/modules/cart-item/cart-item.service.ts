import { Injectable } from '@nestjs/common';
import { FindManyOptions, FindOneOptions, Repository } from 'typeorm';
import { CartItem } from './entities/cart-item.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { CreateCartItemDto, UpdateCartItemDto } from './dto/request';

@Injectable()
export class CartItemService {
  constructor(
    @InjectRepository(CartItem)
    private readonly cartItemRepo: Repository<CartItem>,
  ) {}
  create(dto: CreateCartItemDto) {
    const cartItem = this.cartItemRepo.create(dto);
    return this.cartItemRepo.save(cartItem);
  }

  findAll(options?: FindManyOptions<CartItem>) {
    return this.cartItemRepo.find(options);
  }

  findOne(options: FindOneOptions<CartItem>) {
    return this.cartItemRepo.findOne(options);
  }

  update(id: number, updateCartItemDto: UpdateCartItemDto) {
    return `This action updates a #${id} cartItem`;
  }

  delete(id: string) {
    return this.cartItemRepo.delete(id);
  }
}
