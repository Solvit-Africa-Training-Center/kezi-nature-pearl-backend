import { Category } from '../../entities/category.entity';

export class CategoryResponse {
  id: string;
  image: string | null;
  name: string;
  description: string | null;
  isActive: boolean | undefined;

  constructor(category: Category) {
    this.id = category.id;
    this.image = category.image?.url ?? null;
    this.name = category.name;
    this.description = category.description ?? null;
    this.isActive = category.isActive ?? undefined;
  }
}
