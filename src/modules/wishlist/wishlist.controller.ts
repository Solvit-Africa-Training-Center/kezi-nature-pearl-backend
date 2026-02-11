import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Delete,
  UseGuards,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { WishlistService } from './wishlist.service';
import { CreateWishlistDto } from './dto/create-wishlist.dto';
import { CurrentUser } from 'src/common/decorator';

@Controller('wishlist')
export class WishlistController {
  constructor(private readonly wishlistService: WishlistService) {}

  @UseGuards(AuthGuard('jwt'))
  @Get()
  getWishlist(@CurrentUser() user) {
    return this.wishlistService.getUserWishlist(user.sub);
  }

  @UseGuards(AuthGuard('jwt'))
  @Post()
  addWishlist(@CurrentUser() user, @Body() dto: CreateWishlistDto) {
    return this.wishlistService.addToWishlist(user.sub, dto);
  }

  @UseGuards(AuthGuard('jwt'))
  @Delete(':id')
  removeWishlist(@CurrentUser() user, @Param('id') id: string) {
    return this.wishlistService.removeFromWishlist(user.sub, id);
  }
}
