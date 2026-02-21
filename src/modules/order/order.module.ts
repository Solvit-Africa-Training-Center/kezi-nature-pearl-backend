import { Module } from '@nestjs/common';
import { OrderService } from './order.service';
import { OrderController } from './order.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Order } from './entities/order.entity';
import { ProductModule } from '../product/product.module';
import { ItemModule } from '../item/item.module';

@Module({
  imports: [TypeOrmModule.forFeature([Order]), ItemModule, ProductModule],
  controllers: [OrderController],
  providers: [OrderService],
  exports: [OrderService],
})
export class OrderModule {}
