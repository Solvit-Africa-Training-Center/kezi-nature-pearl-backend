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
  create(@Body() createIngredientDto: CreateIngredientDto) {
    return this.ingredientService.create(createIngredientDto);
  }

  @Get()
  findAll() {
    return this.ingredientService.findAll();
  }

  @Get(':ingredientId')
  findOne(@Param('ingredientId') ingredientId: string) {
    return this.ingredientService.findOne({ ingredientId });
  }

  @Patch(':ingredientId')
  update(
    @Param('ingredientId') id: string,
    @Body() updateIngredientDto: UpdateIngredientDto,
  ) {
    return this.ingredientService.update(id, updateIngredientDto);
  }

  @Delete(':ingredientId')
  remove(@Param('ingredientId') id: string) {
    return this.ingredientService.remove(id);
  }
}
