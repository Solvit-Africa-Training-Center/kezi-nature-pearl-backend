import {
  Entity,
  Column,
  ManyToOne,
  JoinColumn,
  BeforeInsert,
  BeforeUpdate,
} from 'typeorm';
import { IsInt, IsNumber, IsOptional, Min } from 'class-validator';
import { BaseEntity } from '../../../common/entities/base.entity';
import { Cart } from '../../../modules/cart/entities/cart.entity';
import { Product } from '../../../modules/product/entities/product.entity';
import { DecimalColumn } from '../../../common/decorator/decimal-column.decorator';

@Entity('cart_items')
export class CartItem extends BaseEntity {
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

  @BeforeInsert()
  @BeforeUpdate()
  calculateTotalPrice() {
    this.totalPrice = this.unitPrice * this.quantity;
  }
}
