import { Entity, Column, ManyToOne, OneToMany, JoinColumn } from 'typeorm';
import { BaseEntity } from '../../../common/entities/base.entity';
import { File } from '../../../modules/file/entities/file.entity';
import { Product } from '../../../modules/product/entities/product.entity';

@Entity('categories')
export class Category extends BaseEntity {
  @Column({ type: 'uuid', nullable: true })
  imageId?: string | null;

  @ManyToOne(() => File, { nullable: true, onDelete: 'SET NULL' })
  @JoinColumn({ name: 'imageId' })
  image?: File;

  @Column({ unique: true })
  name: string;

  @Column('text', { nullable: true })
  description?: string;

  @Column({ name: 'is_active', default: true })
  isActive?: boolean;

  // Relations
  @OneToMany(() => Product, (product) => product.category)
  products?: Product[];
}
