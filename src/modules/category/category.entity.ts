import { categoryEnum } from '../../common/enums/category.enum';
import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm';
import { Product } from '../product/product.entity';

@Entity('categories')
export class Category {
  @PrimaryGeneratedColumn('uuid')
  categoryId: string;

  @Column({
    type: 'enum',
    enum: categoryEnum,
    default: categoryEnum.ADULTS,
    nullable: false,
  })
  name: categoryEnum;

  @Column({ type: 'text' })
  description: string;

  @OneToMany(() => Product, (products) => products.productId)
  product: Product[];
}
