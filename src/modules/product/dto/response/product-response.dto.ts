import { Product } from '../../entities/product.entity';

export class ProductResponseDto {
  id: string;
  images: string[];
  name: string;
  description: string | null;
  category: string;
  price: number;
  stockQuantity: number;
  ingredients: string;

  constructor(product: Product) {
    this.id = product.id;
    this.images =
      product.images?.map((image) => {
        return image.file.url;
      }) ?? [];
    this.name = product.name;
    this.description = product.description ?? null;
    this.category = product.category?.name ?? undefined;
    this.price = product.price;
    this.stockQuantity = product.stockQuantity;
    this.ingredients = product.ingredients;
  }
}
