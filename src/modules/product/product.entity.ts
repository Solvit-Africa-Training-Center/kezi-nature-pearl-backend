import { productEnum } from 'src/common/enums/product.enum';
import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { Category } from '../category/category.entity';

@Entity('products')
export class Product {
  @PrimaryGeneratedColumn('uuid')
  productId: string;

  @Column()
  name: string;

  @Column()
  description: string;

  @Column()
  productCode: string;

  @Column({
    type: 'enum',
    enum: productEnum,
    default: productEnum.ACTIVE,
    nullable: false,
  })
  status: productEnum;

  @Column()
  categoryId: string;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @ManyToOne(() => Category, (category) => category.categoryId)
  @JoinColumn({ name: 'categoryId' })
  category: Category;
}
