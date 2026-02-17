import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateCategoryDto } from './dto/request/create-category.dto';
import { FindManyOptions, FindOneOptions, Repository } from 'typeorm';
import { Category } from './entities/category.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { UpdateCategoryDto } from './dto/request';
import { FileService } from '../file/file.service';
import { FileType } from 'src/common/enums/product.enum';

@Injectable()
export class CategoryService {
  constructor(
    @InjectRepository(Category)
    private readonly categoryRepo: Repository<Category>,
    private readonly fileService: FileService,
  ) {}
  async create(dto: CreateCategoryDto, picture: Express.Multer.File) {
    const category = this.categoryRepo.create(dto);
    category.image = await this.fileService.save(picture, FileType.IMAGE);
    await this.categoryRepo.save(category);
    return { message: 'Category Created' };
  }

  async findAll(options?: FindManyOptions) {
    return await this.categoryRepo.find(options);
  }

  async findOne(option: FindOneOptions) {
    return await this.categoryRepo.findOne(option);
  }

  async update(
    id: string,
    dto: UpdateCategoryDto,
    picture: Express.Multer.File,
  ) {
    const category = await this.findOne({
      where: { id },
      relations: { image: true },
    });
    if (!category) throw new NotFoundException('Category not found');

    if (category.image) this.fileService.remove(category.image.id);

    category.image = await this.fileService.save(picture, FileType.IMAGE);
    Object.assign(category, dto);

    await this.categoryRepo.update(id, category);
    return { message: 'Category Updated' };
  }

  async remove(categoryIds: string[]) {
    for (const id of categoryIds) {
      const category = await this.findOne({
        where: { id },
        relations: { image: true },
      });

      if (!category) throw new NotFoundException('Category not found');

      if (category.image) this.fileService.remove(category.image.id);

      this.categoryRepo.delete(id);
    }

    return { message: 'Category Deleted' };
  }
}
