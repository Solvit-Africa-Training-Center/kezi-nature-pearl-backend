import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { Product } from 'src/modules/product/product.entity';

@Entity('order_item')
export class OrderItem {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'int' })
  quantity: number;

  @ManyToOne(() => Product, { onDelete: 'CASCADE' }) 
  @JoinColumn({ name: 'product_id' }) 
  product: Product;
}
