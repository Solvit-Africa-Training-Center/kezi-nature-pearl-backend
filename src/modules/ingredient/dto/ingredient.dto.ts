import { PickType } from '@nestjs/swagger';

import { PartialType } from '@nestjs/swagger';

class IngredientBaseDtO {
  ingredientId: string;

  name: string;
}

export class CreateIngredientDto extends PickType(IngredientBaseDtO, [
  'name',
]) {}

export class UpdateIngredientDto extends PartialType(CreateIngredientDto) {}
