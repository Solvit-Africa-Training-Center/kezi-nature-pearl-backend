import { IsUUID, IsNumber, IsString, IsEnum} from "class-validator";
import { ApiProperty } from "@nestjs/swagger";
import { ordersStatusEnum } from "src/common/enums/orders.enum";

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
