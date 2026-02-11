import { IsUUID } from "class-validator";

import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class CreateWishlistDto {
    @IsUUID()
    productId: string
}

export class WishlistResponseDto {
  id: string;
  productId: string;
  productName: string;
  createdAt: Date;
}

