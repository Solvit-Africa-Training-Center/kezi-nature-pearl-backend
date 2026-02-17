import { Module } from '@nestjs/common';
import { ReviewService } from './review.service';
import { ReviewController } from './review.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Review } from './entities/review.entity';
import { Product } from '../product/entities/product.entity';

@Module({
  imports:[TypeOrmModule.forFeature([Review, Product])],
  controllers: [ReviewController],
  providers: [ReviewService],
})
export class ReviewModule {}
