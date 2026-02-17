import { Injectable } from '@nestjs/common';
import { CreateReviewDto } from './dto/create-review.dto';
import { UpdateReviewDto } from './dto/update-review.dto';
import { Repository } from 'typeorm';
import { NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Review } from './entities/review.entity';
import { Product } from '../product/entities/product.entity';
import { BadRequestException } from '@nestjs/common';

@Injectable()
export class ReviewService {
  constructor(
    @InjectRepository(Review)
    private readonly reviewRepo: Repository<Review>,
    @InjectRepository(Product)
    private readonly productRepo: Repository<Product>,
  ) {}

  async getUserReview(userId: string): Promise<Review[]> {
    return this.reviewRepo.find({
      where: { user: { id: userId } },
      order: { createdAt: 'ASC' },
    });
  }
  async createReview(userId: string, dto: CreateReviewDto): Promise<Review> {
    const product = await this.productRepo.findOne({
      where: { id: dto.productId },
    });

    if (!product) {
      throw new NotFoundException('product not found');
    }

    const existing = await this.reviewRepo.findOne({
      where: { userId, productId: dto.productId },
    });

    if (existing) {
      throw new BadRequestException('you have already reviewed a product');
    }
    const review = this.reviewRepo.create({
      userId,
      productId: product.id,
      rating: dto.rating,
      title: dto.title,
      comment: dto.comment,
      skinType: dto.skinType,
    });

    return await this.reviewRepo.save(review);
  }

  async removeReview(
    userId: string,
    reviewId: string,
  ): Promise<{ message: string }> {
    const review = await this.reviewRepo.findOne({
      where: { id: reviewId, user: { id: userId } }, 
    });

    if (!review) throw new NotFoundException('Review not found');

    await this.reviewRepo.remove(review);
    return { message: 'Review deleted successfully' };
  }
}
