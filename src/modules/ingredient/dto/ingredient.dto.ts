import { ApiProperty, PickType } from '@nestjs/swagger';
import { PartialType } from '@nestjs/swagger';
import { IsString, IsUUID } from 'class-validator';

class IngredientBaseDtO {
  @ApiProperty()
  @IsUUID()
  ingredientId: string;

  @ApiProperty()
  @IsString()
  name: string;
}

export class CreateIngredientDto extends PickType(IngredientBaseDtO, [
  'name',
]) {}

export class UpdateIngredientDto extends PartialType(CreateIngredientDto) {}
