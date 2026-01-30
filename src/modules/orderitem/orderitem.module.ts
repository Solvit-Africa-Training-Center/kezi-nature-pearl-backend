import { Module } from '@nestjs/common';
import { OrderItemService } from './orderitem.service';
import { OrderitemController } from './orderitem.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { OrderItem } from './entities/orderitem.entity';

@Module({
  imports: [TypeOrmModule.forFeature([OrderItem])],
  controllers: [OrderitemController],
  providers: [OrderItemService],
})
export class OrderitemModule {}
