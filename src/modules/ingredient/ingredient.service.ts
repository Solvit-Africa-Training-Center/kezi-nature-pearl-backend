import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Ingredient } from './entities/ingredient.entity';
import { CreateIngredientDto, UpdateIngredientDto } from './dto/ingredient.dto';
import { FindOptionsWhere } from 'typeorm';


  @Injectable()
export class IngredientService {
  constructor(
    @InjectRepository(Ingredient)
    private readonly ingredientRepo: Repository<Ingredient>,
  ) {}

  async create(ingredient: CreateIngredientDto) {
    return await this.ingredientRepo.save(ingredient);
  }

  async findAll(filter?: Partial<Ingredient>) {
    const where: FindOptionsWhere<Ingredient> = {};

    if (filter?.ingredientId) where.ingredientId = filter.ingredientId;
    if (filter?.name) where.name = filter.name;

    return await this.ingredientRepo.find({
      where,
      relations: ['products'], 
    });
  }

  async findOne(filter: Partial<Ingredient>) {
    const where: FindOptionsWhere<Ingredient> = {};

    if (filter?.ingredientId) where.ingredientId = filter.ingredientId;
    if (filter?.name) where.name = filter.name;

    return await this.ingredientRepo.findOne({
      where,
      relations: ['products'],
    });
  }

  async update(ingredientId: string, updateIngredientDto: UpdateIngredientDto) {
    const ingredient = await this.findOne({ ingredientId });
    if (!ingredient) throw new NotFoundException('Ingredient not found');

    ingredient.name = updateIngredientDto.name ?? ingredient.name;

    return await this.ingredientRepo.save(ingredient);
  }

  async remove(ingredientId: string) {
    const ingredient = await this.findOne({ ingredientId });
    if (!ingredient) throw new NotFoundException('Ingredient Not Found');

    await this.ingredientRepo.delete({ ingredientId });
    return { message: 'Ingredient deleted successfully' };
  }
}