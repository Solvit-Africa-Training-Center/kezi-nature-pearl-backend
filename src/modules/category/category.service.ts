import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import {
  Repository,
  FindManyOptions,
  FindOneOptions,
  FindOptionsWhere,
} from 'typeorm';
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

 
  async findAll(filter?: FindManyOptions<Category>) {
    return await this.categoryRepo.find({ ...filter });
  }

  async create(category: CreateCategoryDTO) {
    return await this.categoryRepo.save(category);
  }

  async findOne(filter: FindOneOptions<Category>) {
    return await this.categoryRepo.findOne(filter);
  }

  async update(id: IdCategoryDTO, category: UpdateCategoryDTO) {
    const exists = await this.findOne({ where: { categoryId: id.categoryId } });
    if (!exists) throw new NotFoundException('Category not found');

    exists.name = category.name ?? exists.name;
    exists.description = category.description ?? exists.description;

    return await this.categoryRepo.save(exists);
  }

  async hardDelete(id: string) {
    const exists = await this.findOne({ where: { categoryId: id } });
    if (!exists) throw new NotFoundException('Category not found');

    await this.categoryRepo.delete(id);
    return { message: 'Category deleted successfully' };
  }
}
