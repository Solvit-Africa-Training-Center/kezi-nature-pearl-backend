import { Module } from '@nestjs/common';
import { CartItemService } from './cart-item.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CartItem } from './entities/cart-item.entity';
import { CartItemController } from './cart-item.controller';
import { CartModule } from '../cart/cart.module';
import { ProductModule } from '../product/product.module';

@Module({
  imports: [TypeOrmModule.forFeature([CartItem]), CartModule, ProductModule],
  controllers: [CartItemController],
  providers: [CartItemService],
  exports: [CartItemService],
})
export class CartItemModule {}
