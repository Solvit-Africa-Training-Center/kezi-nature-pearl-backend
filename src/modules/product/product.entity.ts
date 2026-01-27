import { productEnum } from 'src/common/enums/product.enum';
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
