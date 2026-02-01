import { IsUUID, IsNumber, IsEnum } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { ordersStatusEnum } from '@/common/enums/orders.enum';

export class CreateOrderDto {
  @ApiProperty({ format: 'uuid' })
  @IsUUID()
  user_id: string;

  @ApiProperty({ example: 3000 })
  @IsNumber()
  total_amount: number;

  @ApiProperty({
    enum: ordersStatusEnum,
    required: false,
    default: ordersStatusEnum.PLACED,
  })
  @IsEnum(ordersStatusEnum)
  order_status?: ordersStatusEnum;
}
