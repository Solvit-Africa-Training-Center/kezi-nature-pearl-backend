import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Query,
} from '@nestjs/common';
import { ApiOperation } from '@nestjs/swagger';
import { CategoryService } from './category.service';
import {
  CategoryDTO,
  CreateCategoryDTO,
  IdCategoryDTO,
  UpdateCategoryDTO,
} from './category.dto';

@Controller('category')
export class CategoryController {
  constructor(private readonly categoryService: CategoryService) {}

  
  @Get()
  async findAll() {
    return await this.categoryService.findAll();
  }

  @Post()
  async addCategory(@Body() dto: CreateCategoryDTO) {
    const category = await this.categoryService.create(dto);
    return category; 
  }

  @ApiOperation({ summary: 'Update new Category' })
  @Patch(':categoryId')
  async updateCategory(
    @Param() id: IdCategoryDTO,
    @Body() dto: UpdateCategoryDTO,
  ) {
    await this.categoryService.update(id, dto);
    return 'Product Category Updated ';
  }

  @ApiOperation({ summary: 'Delete Category' })
  @Delete(':categoryId')
  async deleteCategory(@Param() id: IdCategoryDTO) {
    await this.categoryService.hardDelete(id.categoryId);
  }
}
