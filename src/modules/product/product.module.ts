import { Module } from '@nestjs/common';
import { ProductService } from './product.service';
import { ProductController } from './product.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Product } from './entities/product.entity';
import { ProductImageModule } from '../product-image/product-image.module';
import { CurrencyModule } from '../currencies/currencies.module';
import { UserPreferencesModule } from '../user-preferences/user-preferences.module';
import { CartModule } from '../cart/cart.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([Product]),
    ProductImageModule,
    CurrencyModule,
    UserPreferencesModule,
  ],
  controllers: [ProductController],
  providers: [ProductService],
  exports: [ProductService],
})
export class ProductModule {}
