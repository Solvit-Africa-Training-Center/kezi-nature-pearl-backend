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
} from '@nestjs/common';
import { ReviewService } from './review.service';
import { CreateReviewDto } from './dto/create-review.dto';
import { CurrentUser, Roles } from 'src/common/decorator';
import { AuthGuard, OptionalAuthGuard, RolesGuard } from 'src/common/guards';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { UserRole } from 'src/common/enums/user.enum';
import { GuestInterceptor } from 'src/common/interceptors/guest.interceptor';

@Controller('reviews')
@UseGuards(OptionalAuthGuard)
@UseInterceptors(GuestInterceptor)
@ApiBearerAuth()
export class ReviewController {
  constructor(private readonly reviewService: ReviewService) {}

  @Get('product/:productId')
  getProductReviews(@Req() req: Request) {
    const userId = req['user']?.sub ?? null;
    const guestId = req['guestId'] ?? null;

    return this.reviewService.getUserReview(userId);
  }

  @Post()
  createReview(@Req() req: Request, @Body() dto: CreateReviewDto) {
    const userId = req['user']?.sub ?? null;
    const guestId = req['guestId'] ?? null;

    return this.reviewService.createReview(userId, dto);
  }

  @Delete(':id')
  deleteReview(@Req() req: Request, @Param('id') id: string) {
    const userId = req['user']?.sub ?? null;
    const guestId = req['guestId'] ?? null;

    return this.reviewService.removeReview(userId, id);
  }
}
