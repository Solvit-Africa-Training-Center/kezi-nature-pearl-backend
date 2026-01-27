import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Category } from './category.entity';
import { Repository } from 'typeorm';
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

  async find(filters?: Partial<Category>) {
    return await this.categoryRepo.find({ where: filters });
  }

  async create(category: CreateCategoryDTO) {
    return await this.categoryRepo.save(category);
  }

  async update(id: IdCategoryDTO, category: UpdateCategoryDTO) {
    const exists = await this.findOne({ categoryId: id.categoryId });
    if (!exists) throw new NotFoundException();
    exists.name = category.name ?? exists.name;
    exists.description = category.description ?? exists.description;
    return await this.categoryRepo.save(category);
  }

  async findOne(filter: Partial<Category>) {
    return await this.categoryRepo.findOne({ where: filter });
  }

  async hardDelete(id: string) {
    await this.categoryRepo.delete(id);
  }
}
