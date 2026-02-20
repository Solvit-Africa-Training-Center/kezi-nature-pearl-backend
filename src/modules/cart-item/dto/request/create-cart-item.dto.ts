import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsInt, IsUUID, Min } from 'class-validator';

export class AddItemTocartDto {
  @ApiProperty()
  @IsUUID()
  productId: string;

  @ApiProperty()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  quantity: number;
}
