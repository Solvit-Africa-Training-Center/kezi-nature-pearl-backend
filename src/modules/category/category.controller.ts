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

  @ApiOperation({summary: 'List all categories'})
  @Get()
  async findAll() {
    return await this.categoryService.findAll();
  }
@ApiOperation({summary: 'Create Category'})
  @Post()
  async addCategory(@Body() dto: CreateCategoryDTO) {
    const category = await this.categoryService.create(dto);
    return {message: 'category created successfully'}; 
  }

  @ApiOperation({ summary: 'Update new Category' })
  @Patch(':categoryId')
  async updateCategory(
    @Param() id: IdCategoryDTO,
    @Body() dto: UpdateCategoryDTO,
  ) {
    await this.categoryService.update(id, dto);
    return { message:'Product Category Updated'};
  }

  @ApiOperation({ summary: 'Delete Category' })
  @Delete(':categoryId')
  async deleteCategory(@Param() id: IdCategoryDTO) {
    await this.categoryService.hardDelete(id.categoryId);
     return { message: 'category deleted successfully' };
  }
}
