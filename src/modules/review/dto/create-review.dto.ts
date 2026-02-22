import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsInt, Min, Max } from 'class-validator';

export class CreateReviewDto {
  @ApiProperty({ description: 'Rating between 1 and 5' })
  @IsInt()
  @Min(1)
  @Max(5)
  rating: number;

  @ApiProperty({ description: 'Optional review comment', required: false })
  @IsString()
  comment: string;
}
