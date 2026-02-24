import { Injectable, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Wishlist } from './entities/wishlist.entity';
import { Repository } from 'typeorm';
import { Product } from '../product/entities/product.entity';
import { NotFoundException } from '@nestjs/common';

@Injectable()
export class WishlistService {
  constructor(
    @InjectRepository(Wishlist)
    private readonly wishlistRepo: Repository<Wishlist>,
    @InjectRepository(Product)
    private readonly productRepo: Repository<Product>,
  ) {}

  async getUserWishlist(userId: string): Promise<Wishlist[]> {
    return this.wishlistRepo.find({
      where: { user: { id: userId } },
      order: { createdAt: 'ASC' },
      relations: {
        product: { images: { file: true }, category: { image: true } },
      },
    });
  }

  async addToWishlist(userId: string, productId: string) {
    const product = await this.productRepo.findOne({
      where: { id: productId },
    });
    if (!product) throw new NotFoundException('Product not found');

    const existing = await this.wishlistRepo.findOne({
      where: { user: { id: userId }, product: { id: productId } },
    });

    if (existing) throw new BadRequestException('Product already in wishlist');

    const wishlistItem = this.wishlistRepo.create({
      user: { id: userId },
      product,
    });

    this.wishlistRepo.save(wishlistItem);
    return { message: 'Product added to Wishlist' };
  }

  async removeFromWishlist(
    userId: string,
    wishlistId: string,
  ): Promise<{ message: string }> {
    const item = await this.wishlistRepo.findOne({
      where: { id: wishlistId, user: { id: userId } },
    });
    if (!item) throw new NotFoundException('Wishlist item not found');

    await this.wishlistRepo.remove(item);
    return { message: 'Item removed from wishlist' };
  }
}
