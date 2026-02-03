import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
} from '@nestjs/common';
import { IngredientService } from './ingredient.service';
import { CreateIngredientDto, UpdateIngredientDto } from './dto/ingredient.dto';

@Controller('ingredient')
export class IngredientController {
  constructor(private readonly ingredientService: IngredientService) {}

  @Post()
  async create(@Body() createIngredientDto: CreateIngredientDto) {
    await this.ingredientService.create(createIngredientDto);
    return 'Ingredient Created';
  }

  @Get()
  async findAll() {
    return await this.ingredientService.findAll();
  }

  @Get(':ingredientId')
  findOne(@Param('ingredientId') ingredientId: string) {
    return this.ingredientService.findOne({ where: { ingredientId } });
  }

  @Patch(':ingredientId')
  async update(
    @Param('ingredientId') id: string,
    @Body() updateIngredientDto: UpdateIngredientDto,
  ) {
    this.ingredientService.update(id, updateIngredientDto);
    return 'Ingredient Updated';
  }

  @Delete(':ingredientId')
  async remove(@Param('ingredientId') id: string) {
    this.ingredientService.remove(id);
    return 'Ingredient Deleted';
  }
}
