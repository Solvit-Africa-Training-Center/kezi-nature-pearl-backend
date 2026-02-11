import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  NotFoundException,
  UploadedFile,
  UseInterceptors,
} from '@nestjs/common';
import { CategoryService } from './category.service';
import { CreateCategoryDto, UpdateCategoryDto } from './dto/request';
import { CategoryResponse } from './dto/response';
import { ApiConsumes } from '@nestjs/swagger';
import { FileInterceptor } from '@nestjs/platform-express';
import { FileUploadInterceptor } from 'src/common/interceptors/file-upload.interceptor';

@Controller('category')
export class CategoryController {
  constructor(private readonly categoryService: CategoryService) {}

  @Post()
  @UseInterceptors(new FileUploadInterceptor('picture', 1))
  @ApiConsumes('multipart/form-data')
  async create(
    @Body() dto: CreateCategoryDto,
    @UploadedFile() picture: Express.Multer.File,
  ) {
    return await this.categoryService.create(dto, picture);
  }

  @Get()
  async findAll() {
    return (await this.categoryService.findAll({ relations: ['image'] })).map(
      (category) => {
        return new CategoryResponse(category);
      },
    );
  }

  @Get(':id')
  async findOne(@Param('id') id: string) {
    const category = await this.categoryService.findOne({
      where: { id },
      relations: ['image'],
    });
    if (!category) throw new NotFoundException('Category not found');
    return new CategoryResponse(category);
  }

  @Patch(':id')
  @UseInterceptors(new FileUploadInterceptor('picture', 1))
  @ApiConsumes('multipart/form-data')
  async update(
    @Param('id') id: string,
    @Body() dto: UpdateCategoryDto,
    @UploadedFile() picture: Express.Multer.File,
  ) {
    return await this.categoryService.update(id, dto, picture);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.categoryService.remove(id);
  }
}
