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

@Controller('wishlist')
@UseGuards(AuthGuard, RolesGuard)
@Roles(UserRole.CUSTOMER)
@ApiBearerAuth()
export class WishlistController {
  constructor(private readonly wishlistService: WishlistService) {}

  @Get()
  getWishlist(@CurrentUser() user) {
    return this.wishlistService.getUserWishlist(user.sub);
  }
 @Post()
  addWishlist(@CurrentUser() user, @Body() dto: CreateWishlistDto) {
    return this.wishlistService.addToWishlist(user.sub, dto);
  }

  @Delete(':id')
  removeWishlist(@CurrentUser() user, @Param('id') id: string) {
    return this.wishlistService.removeFromWishlist(user.sub, id);
  }
}
