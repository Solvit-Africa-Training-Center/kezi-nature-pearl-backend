import {
  Controller,
  Get,
  Post,
  Delete,
  Body,
  Param,
  UseGuards,
} from '@nestjs/common';
import { ReviewService } from './review.service';
import { CreateReviewDto } from './dto/create-review.dto';
import { CurrentUser, Roles } from 'src/common/decorator';
import { AuthGuard, RolesGuard } from 'src/common/guards';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { UserRole } from 'src/common/enums/user.enum';

@Controller('reviews')
@UseGuards(AuthGuard, RolesGuard)
@Roles(UserRole.CUSTOMER)
@ApiBearerAuth()
export class ReviewController {
  constructor(private readonly reviewService: ReviewService) {}

  @Get('product/:productId')
  getProductReviews(@CurrentUser()user) {
    return this.reviewService.getUserReview(user.sub);
  }

  @Post()
  createReview(@CurrentUser() user, @Body() dto: CreateReviewDto) {
    return this.reviewService.createReview(user.sub, dto);
  }

  @Delete(':id')
  deleteReview(@CurrentUser() user, @Param('id') id: string) {
    return this.reviewService.removeReview(user.sub, id);
  }
}
