import { Injectable } from '@nestjs/common';
import { CreateReviewDto } from './dto/create-review.dto';
import { UpdateReviewDto } from './dto/update-review.dto';
import { Repository } from 'typeorm';
import { NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Review } from './entities/review.entity';
import { Product } from '../product/entities/product.entity';
import { BadRequestException } from '@nestjs/common';
import { setUserGuestId } from 'src/util';

@Injectable()
export class ReviewService {
  constructor(
    @InjectRepository(Review)
    private readonly reviewRepo: Repository<Review>,
    @InjectRepository(Product)
    private readonly productRepo: Repository<Product>,
  ) {}

  async createReview(
    owner: { userId?: string | null; guestId?: string | null },
    productId: string,
    dto: CreateReviewDto,
  ) {
    const { userId, guestId } = setUserGuestId(owner);

    const product = await this.productRepo.findOne({
      where: { id: productId },
    });

    if (!product) {
      throw new NotFoundException('product not found');
    }

    const review = this.reviewRepo.create({
      userId,
      guestId,
      productId: product.id,
      rating: dto.rating,
      comment: dto.comment,
    });

    await this.reviewRepo.save(review);
    return { message: 'Product review made' };
  }

  async getProductReview(productId: string) {
    const reviews = await this.reviewRepo.find({
      where: { productId },
      relations: { user: true },
      order: { createdAt: 'ASC' },
    });

    return reviews.map((review) => ({
      id: review.id,
      rating: review.rating,
      comment: review.comment,
      createdAt: review.createdAt,
      isVerifiedPurchase: review.isVerifiedPurchase,
      reviewer: review.user
        ? {
            id: review.user.id,
            name: review.user.fullName,
          }
        : {
            guestId: review.guestId,
          },
    }));
  }

  async updateReview(
    owner: { userId?: string | null; guestId?: string | null },
    id: string,
    dto: UpdateReviewDto,
  ) {
    const { userId, guestId } = setUserGuestId(owner);

    const review = await this.reviewRepo.findOne({
      where: { id, userId, guestId },
    });

    if (!review) throw new NotFoundException('Review not found');

    Object.assign(review, dto);

    await this.reviewRepo.update(review.id, review);
    return { message: 'Review Updated' };
  }

  async removeReview(
    owner: { userId?: string | null; guestId?: string | null },
    id: string,
  ): Promise<{ message: string }> {
    const { userId, guestId } = setUserGuestId(owner);

    const review = await this.reviewRepo.findOne({
      where: { id, userId, guestId },
    });

    if (!review) throw new NotFoundException('Review not found');

    await this.reviewRepo.remove(review);
    return { message: 'Review deleted successfully' };
  }
}
