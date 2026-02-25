import { Product } from '../../entities/product.entity';

import { Expose, Transform } from 'class-transformer';

export class ProductResponseDto {
  id: string;
  images: string[];
  name: string;
  description: string | null;
  category: { name: string; image: string } | undefined;

  price: number;

  @Expose({ name: 'priceFormatted' })
  @Transform(({ value }) =>
    value === null || value === undefined ? undefined : value,
  )
  priceFormatted?: string;

  oldPrice?: number;

  @Expose({ name: 'oldPriceFormatted' })
  @Transform(({ value }) =>
    value === null || value === undefined ? undefined : value,
  )
  oldPriceFormatted?: string;

  stockQuantity: number;
  ingredients: string;
  createdAt: Date;

  constructor(product: Product) {
    this.id = product.id;
    this.images = product.images?.map((img) => img.file.url) ?? [];
    this.name = product.name;
    this.description = product.description ?? null;
    this.category =
      product.category && product.category.image
        ? { name: product.category.name, image: product.category.image.url }
        : undefined;
    this.price = product.price;
    this.oldPrice = product.oldPrice;
    this.stockQuantity = product.stockQuantity;
    this.ingredients = product.ingredients;
    this.createdAt = product.createdAt;
    this.priceFormatted = product['priceFormatted'];
    this.oldPriceFormatted = product['oldPriceFormatted'];
  }
}
