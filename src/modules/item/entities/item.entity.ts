import {
  Entity,
  Column,
  ManyToOne,
  JoinColumn,
  BeforeInsert,
  BeforeUpdate,
} from 'typeorm';
import { BaseEntity } from '../../../common/entities/base.entity';
import { Cart } from '../../cart/entities/cart.entity';
import { Product } from '../../product/entities/product.entity';
import { DecimalColumn } from '../../../common/decorator/decimal-column.decorator';
import { Order } from '../../../modules/order/entities/order.entity';

@Entity('items')
export class Item extends BaseEntity {
  @Column()
  cartId: string;

  @ManyToOne(() => Cart, (cart) => cart.items, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'cartId' })
  cart: Cart;

  @Column()
  productId: string;

  @ManyToOne(() => Product, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'productId' })
  product: Product;

  @Column('int')
  quantity: number;

  @DecimalColumn({ name: 'unit_price' })
  unitPrice: number;

  @DecimalColumn({ name: 'total_price' })
  totalPrice: number;

  @Column({ nullable: true })
  orderId: string;

  @ManyToOne(() => Order, (order) => order.items, {
    nullable: true,
    onDelete: 'SET NULL',
  })
  @JoinColumn({ name: 'orderId' })
  order: Order;

  @BeforeInsert()
  @BeforeUpdate()
  calculateTotalPrice() {
    this.totalPrice = this.unitPrice * this.quantity;
  }
}
