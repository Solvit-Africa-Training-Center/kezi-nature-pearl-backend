import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateCategoryDto } from './dto/request/create-category.dto';
import { FindManyOptions, FindOneOptions, Repository } from 'typeorm';
import { Category } from './entities/category.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { UpdateCategoryDto } from './dto/request';
import { FileService } from '../file/file.service';
import { FileType } from 'src/common/enums/product.enum';
import { File } from '../file/entities/file.entity';

@Injectable()
export class CategoryService {
  constructor(
    @InjectRepository(Category)
    private readonly categoryRepo: Repository<Category>,
    private readonly fileService: FileService,
  ) {}
  async create(dto: CreateCategoryDto, picture?: Express.Multer.File) {
    let imageId: string | null = null;
    if (picture) {
      const image = await this.fileService.save(picture, FileType.IMAGE);
      imageId = image.id;
    }
    await this.categoryRepo.save({ ...dto, ...{ imageId } });
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
    picture?: Express.Multer.File,
  ) {
    const category = await this.findOne({ where: { id } });
    if (!category) throw new NotFoundException('Category not found');

    let imageId: string | null = null;

    if (picture) {
      const image = await this.fileService.save(picture, FileType.IMAGE);
      imageId = image.id;
    }

    await this.categoryRepo.update(id, { ...dto, imageId });
    return { message: 'Category Updated' };
  }

  async remove(id: string) {
    const category = await this.findOne({
      where: { id },
      relations: ['image'],
    });
    if (!category) throw new NotFoundException('Category not found');

    await this.categoryRepo.delete(id);
    if (category.image) {
      this.fileService.remove(category.image.id);
    }

    return { message: 'Category Deleted' };
  }
}
