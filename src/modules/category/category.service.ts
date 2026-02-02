import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, FindOptionsWhere } from 'typeorm';
import { Category } from './category.entity';
import {
  CreateCategoryDTO,
  IdCategoryDTO,
  UpdateCategoryDTO,
} from './category.dto';

@Injectable()
export class CategoryService {
  constructor(
    @InjectRepository(Category)
    private readonly categoryRepo: Repository<Category>,
  ) {}

  // ✅ FIXED
  async find(filters?: Partial<Category>) {
    const where: FindOptionsWhere<Category> = {};

    // Only scalar fields are allowed in WHERE
    if (filters?.categoryId) where.categoryId = filters.categoryId;
    if (filters?.name) where.name = filters.name;

    return await this.categoryRepo.find({
      where,
      relations: ['products'], // relations go here
    });
  }

  async create(category: CreateCategoryDTO) {
    return await this.categoryRepo.save(category);
  }

  // ✅ FIXED
  async update(id: IdCategoryDTO, category: UpdateCategoryDTO) {
    const exists = await this.findOne({ categoryId: id.categoryId });
    if (!exists) throw new NotFoundException('Category not found');

    exists.name = category.name ?? exists.name;
    exists.description = category.description ?? exists.description;

    // ❗ IMPORTANT: save `exists`, not `category`
    return await this.categoryRepo.save(exists);
  }

  // ✅ FIXED
  async findOne(filter: Partial<Category>) {
    const where: FindOptionsWhere<Category> = {};

    if (filter?.categoryId) where.categoryId = filter.categoryId;
    if (filter?.name) where.name = filter.name;

    return await this.categoryRepo.findOne({
      where,
      relations: ['products'],
    });
  }

  async hardDelete(id: string) {
    await this.categoryRepo.delete(id);
  }
}
