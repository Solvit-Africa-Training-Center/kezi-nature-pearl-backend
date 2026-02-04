import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm';
import { Product } from '../product/product.entity';

@Entity('categories')
export class Category {
  @PrimaryGeneratedColumn('uuid')
  categoryId: string;

  @Column({
    
    unique: true,
  })
  name: string;

  @Column({ type: 'text' })
  description: string;

  @OneToMany(() => Product, (products) => products.productId)
  product: Product[];
}
