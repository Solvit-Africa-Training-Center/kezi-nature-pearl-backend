import { Product } from 'src/modules/product/product.entity';
import {
  Column,
  Entity,
  JoinTable,
  ManyToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';

@Entity('ingredients')
export class Ingredient {
  @PrimaryGeneratedColumn('uuid')
  ingredientId: string;

  @Column()
  name: string;

  @ManyToMany(() => Product, (product) => product.ingredients)
  products: Product[];
}
