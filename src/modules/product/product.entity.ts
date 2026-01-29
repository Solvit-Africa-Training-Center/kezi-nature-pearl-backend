import { productStatusEnum } from '../../common/enums/productStatus.enum';
import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  JoinTable,
  ManyToMany,
  ManyToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { Category } from '../category/category.entity';
import { Ingredient } from '../ingredient/entities/ingredient.entity';

@Entity('products')
export class Product {
  @PrimaryGeneratedColumn('uuid')
  productId: string;

  @Column({ nullable: true })
  imageId: string;

  @Column()
  name: string;

  @Column()
  description: string;

  @Column({
    type: 'enum',
    enum: productStatusEnum,
    default: productStatusEnum.ACTIVE,
    nullable: false,
  })
  status: productStatusEnum;

  @Column()
  categoryId: string;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @ManyToOne(() => Category, (category) => category.categoryId)
  @JoinColumn({ name: 'categoryId' })
  category: Category;

  @ManyToMany(() => Ingredient, (ingredient) => ingredient.products)
  @JoinTable({
    name: 'productIngredient',
    joinColumn: {
      name: 'productId',
      referencedColumnName: 'productId',
    },
    inverseJoinColumn: {
      name: 'ingredientId',
      referencedColumnName: 'ingredientId',
    },
  })
  ingredients: Ingredient[];
}
