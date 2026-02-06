import { Entity, Column, ManyToOne, JoinColumn, Index } from 'typeorm';
import { IsBoolean, IsInt, Min } from 'class-validator';
import { BaseEntity } from '../../../common/entities/base.entity';
import { Product } from '../../../modules/product/entities/product.entity';
import { File } from '../../../modules/file/entities/file.entity';

@Entity('product_images')
@Index(['productId', 'displayOrder'])
export class ProductImage extends BaseEntity {
  @Column()
  productId: string;

  @ManyToOne(() => Product, (product) => product.images, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'productId' })
  product: Product;

  @Column()
  fileId: string;

  @ManyToOne(() => File, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'fileId' })
  file: File;

  @Column({ name: 'display_order', default: 0 })
  @IsInt()
  @Min(0)
  displayOrder: number;

  @Column({ name: 'is_primary', default: false })
  @IsBoolean()
  isPrimary: boolean;
}
