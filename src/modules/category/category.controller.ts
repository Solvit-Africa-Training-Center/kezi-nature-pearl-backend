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

  @ApiOperation({ summary: 'List Categories' })
  @Get()
  async listCategory(@Query() dto: CategoryDTO) {
    return await this.categoryService.find(dto);
  }

  @ApiOperation({ summary: 'Add new Category' })
  @Post()
  async addCategory(@Body() dto: CreateCategoryDTO) {
    await this.categoryService.create(dto);
    return 'Product category added';
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
