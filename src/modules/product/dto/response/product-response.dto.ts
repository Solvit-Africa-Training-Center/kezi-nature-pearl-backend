import { Product } from '../../entities/product.entity';

export class ProductResponseDto {
  id: string;
  images: string[];
  name: string;
  description: string | null;
  category: { name: string; image: string } | undefined;
  price: number;
  stockQuantity: number;
  ingredients: string;
  createdAt: Date;

  constructor(product: Product) {
    this.id = product.id;
    this.images =
      product.images?.map((image) => {
        return image.file.url;
      }) ?? [];
    this.name = product.name;
    this.description = product.description ?? null;
    this.category =
      product.category && product.category.image
        ? { name: product.category.name, image: product.category.image.url }
        : undefined;
    this.price = product.price;
    this.stockQuantity = product.stockQuantity;
    this.ingredients = product.ingredients;
    this.createdAt = product.createdAt;
  }
}
