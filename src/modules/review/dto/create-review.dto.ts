import { IsUUID, IsNotEmpty } from "class-validator";
import { ApiProperty } from "@nestjs/swagger"; 
import { IsString,IsOptional,IsEnum, IsInt, Min, Max} from "class-validator";  
import { SkinType } from '../../../common/enums/user.enum';  
// import { Min } from "class-validator";

export class CreateReviewDto {
  @ApiProperty({
    description: 'Id of the product to be reviewed',
  })
  @IsUUID()
  @IsNotEmpty()
  productId: string;

  @ApiProperty({ description: 'Rating between 1 and 5' })
  @IsInt()
  @Min(1)
  @Max(5)
  rating: number;

  @ApiProperty({ description: 'Optional review title', required: false })
  @IsOptional()
  @IsString()
  title?: string;

  @ApiProperty({ description: 'Optional review comment', required: false })
  @IsOptional()
  @IsString()
  comment?: string;

  @ApiProperty({
    description: 'Optional skin type',
    required: false,
    enum: SkinType,
  })
  @IsOptional()
  @IsEnum(SkinType)
  skinType?: SkinType;
}

