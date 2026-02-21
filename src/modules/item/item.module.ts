import { Module } from '@nestjs/common';
import { ItemService } from './item.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Item } from './entities/item.entity';
import { ProductModule } from '../product/product.module';

@Module({
  imports: [TypeOrmModule.forFeature([Item]), ProductModule],
  providers: [ItemService],
  exports: [ItemService],
})
export class ItemModule {}
