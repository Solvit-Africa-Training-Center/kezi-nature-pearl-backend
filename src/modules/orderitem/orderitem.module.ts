import { Module } from '@nestjs/common';
import { OrderItemService } from './orderitem.service';
import { OrderitemController } from './orderitem.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { OrderItem } from './entities/orderitem.entity';
import { Product } from '../product/product.entity';

@Module({
  imports: [TypeOrmModule.forFeature([OrderItem, Product])],
  controllers: [OrderitemController],
  providers: [OrderItemService],
})
export class OrderItemModule {}
