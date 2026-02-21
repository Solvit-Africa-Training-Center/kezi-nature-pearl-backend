import { Entity, Column, ManyToOne, JoinColumn } from 'typeorm';
import { BaseEntity } from '../../../common/entities/base.entity';
import { Order } from '../../../modules/order/entities/order.entity';
import { Product } from '../../../modules/product/entities/product.entity';
import { DecimalColumn } from '../../../common/decorator/decimal-column.decorator';

@Entity('order_items')
export class OrderItem extends BaseEntity {
  @Column('uuid')
  orderId: string;

  @ManyToOne(() => Order, (order) => order.items, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'orderId' })
  order: Order;

  @Column()
  productId: string;

  @ManyToOne(() => Product)
  @JoinColumn({ name: 'productId' })
  product: Product;

  @Column('int')
  quantity: number;

  @DecimalColumn({ name: 'unit_price' })
  unitPrice: number;

  @DecimalColumn({ name: 'total_price' })
  totalPrice: number;
}
