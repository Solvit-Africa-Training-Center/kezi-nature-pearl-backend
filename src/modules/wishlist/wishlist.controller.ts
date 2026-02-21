import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Delete,
  UseGuards,
} from '@nestjs/common';
import { WishlistService } from './wishlist.service';
import { CreateWishlistDto } from './dto/create-wishlist.dto';
import { CurrentUser, Roles } from 'src/common/decorator';
import { AuthGuard, RolesGuard } from 'src/common/guards';
import { ApiBearerAuth } from '@nestjs/swagger';
import { UserRole } from 'src/common/enums/user.enum';
import { WishlistResponseDto } from './dto/response/wishlist-response.dto';

@Controller('wishlist')
@UseGuards(AuthGuard, RolesGuard)
@Roles(UserRole.CUSTOMER)
@ApiBearerAuth()
export class WishlistController {
  constructor(private readonly wishlistService: WishlistService) {}

  @Get()
  async getWishlist(@CurrentUser() user) {
    return (await this.wishlistService.getUserWishlist(user.sub)).map(
      (wishlist) => {
        return new WishlistResponseDto(wishlist);
      },
    );
  }
  @Post('productId')
  addWishlist(@CurrentUser() user, @Param('productId') productId: string) {
    return this.wishlistService.addToWishlist(user.sub, productId);
  }

  @Delete(':id')
  removeWishlist(@CurrentUser() user, @Param('id') id: string) {
    return this.wishlistService.removeFromWishlist(user.sub, id);
  }
}
