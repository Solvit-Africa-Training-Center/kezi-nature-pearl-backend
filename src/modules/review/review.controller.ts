import {
  Controller,
  Get,
  Post,
  Delete,
  Body,
  Param,
  UseGuards,
  UseInterceptors,
  Req,
  Patch,
} from '@nestjs/common';
import { ReviewService } from './review.service';
import { CreateReviewDto } from './dto/create-review.dto';
import { OptionalAuthGuard } from 'src/common/guards';
import { ApiBearerAuth } from '@nestjs/swagger';
import { GuestInterceptor } from 'src/common/interceptors/guest.interceptor';
import { UpdateReviewDto } from './dto/update-review.dto';

@Controller('reviews')
@UseGuards(OptionalAuthGuard)
@UseInterceptors(GuestInterceptor)
@ApiBearerAuth()
export class ReviewController {
  constructor(private readonly reviewService: ReviewService) {}

  @Post(':productId')
  createReview(
    @Req() req: Request,
    @Param('productId') productId: string,
    @Body() dto: CreateReviewDto,
  ) {
    const userId = req['user']?.sub ?? null;
    const guestId = req['guestId'] ?? null;

    return this.reviewService.createReview({ userId, guestId }, productId, dto);
  }

  @Get('product/:productId')
  async getProductReviews(@Param('productId') productId: string) {
    return await this.reviewService.getProductReview(productId);
  }

  @Patch(':id')
  async updateReview(
    @Req() req: Request,
    @Param('id') id: string,
    @Body() dto: UpdateReviewDto,
  ) {
    const userId = req['user']?.sub ?? null;
    const guestId = req['guestId'] ?? null;

    return await this.reviewService.updateReview({ userId, guestId }, id, dto);
  }

  @Delete(':id')
  deleteReview(@Req() req: Request, @Param('id') id: string) {
    const userId = req['user']?.sub ?? null;
    const guestId = req['guestId'] ?? null;

    return this.reviewService.removeReview({ userId, guestId }, id);
  }
}
