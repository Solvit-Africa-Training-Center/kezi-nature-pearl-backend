import { Entity, Column, ManyToOne, JoinColumn } from 'typeorm';
import { IsInt, IsNumber, IsOptional, IsString, Min } from 'class-validator';
import { BaseEntity } from '../../../common/entities/base.entity';
import { Order } from '../../../modules/order/entities/order.entity';
import { Product } from '../../../modules/product/entities/product.entity';
import { DecimalColumn } from '../../../common/decorator/decimal-column.decorator';

@Entity('order_items')
export class OrderItem extends BaseEntity {
  @Column()
  orderId: string;

  @ManyToOne(() => Order, (order) => order.items, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'orderId' })
  order: Order;

  @Column()
  productId: string;

  @ManyToOne(() => Product)
  @JoinColumn({ name: 'productId' })
  product: Product;

  @Column({ name: 'product_name' })
  @IsString()
  productName: string;

  @Column({ name: 'variant_name', nullable: true })
  @IsOptional()
  @IsString()
  variantName?: string;

  @Column('int')
  @IsInt()
  @Min(1)
  quantity: number;

  @DecimalColumn({ name: 'unit_price' })
  @IsNumber()
  @Min(0)
  unitPrice: number;

  @DecimalColumn({ name: 'total_price' })
  @IsNumber()
  @Min(0)
  totalPrice: number;
}
