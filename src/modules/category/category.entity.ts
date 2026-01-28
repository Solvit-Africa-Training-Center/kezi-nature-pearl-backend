import { productCategoryEnum } from '../../common/enums/productCategory.enum';
import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm';
import { Product } from '../product/product.entity';

@Entity('categories')
export class Category {
  @PrimaryGeneratedColumn('uuid')
  categoryId: string;

  @Column({
    type: 'enum',
    enum: productCategoryEnum,
    default: productCategoryEnum.ADULTS,
    nullable: false,
  })
  name: productCategoryEnum;

  @Column({ type: 'text' })
  description: string;

  @OneToMany(() => Product, (products) => products.productId)
  product: Product[];
}
