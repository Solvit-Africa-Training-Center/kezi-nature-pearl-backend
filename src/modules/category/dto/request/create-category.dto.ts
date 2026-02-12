import { PickType } from '@nestjs/swagger';
import { CategoryRequestBaseDto } from './base-category.dto';

export class CreateCategoryDto extends PickType(CategoryRequestBaseDto, [
  'picture',
  'name',
  'description',
]) {}
