import {
  Entity,
  Column,
  ManyToOne,
  OneToMany,
  JoinColumn,
  Tree,
  TreeChildren,
  TreeParent,
  Index,
} from 'typeorm';
import { IsBoolean, IsInt, IsOptional, IsString, Min } from 'class-validator';
import { BaseEntity } from '../../../common/entities/base.entity';
import { File } from '../../../modules/file/entities/file.entity';
import { Product } from '../../../modules/product/entities/product.entity';

@Entity('categories')
@Tree('closure-table')
@Index(['slug'], { unique: true })
export class Category extends BaseEntity {
  @Column({ type: 'uuid', nullable: true })
  imageId?: string;

  @ManyToOne(() => File, { nullable: true })
  @JoinColumn({ name: 'imageId' })
  image?: File;

  @TreeParent()
  parent?: Category;

  @TreeChildren()
  children?: Category[];

  @Column()
  @IsString()
  name: string;

  @Column({ unique: true })
  @IsString()
  slug: string;

  @Column('text', { nullable: true })
  @IsOptional()
  @IsString()
  description?: string;

  @Column({ name: 'is_active', default: true })
  @IsBoolean()
  isActive: boolean;

  @Column({ name: 'display_order', default: 0 })
  @IsInt()
  @Min(0)
  displayOrder: number;

  // Relations
  @OneToMany(() => Product, (product) => product.category)
  products?: Product[];
}
