import { Entity, Column, ManyToOne, JoinColumn } from 'typeorm';
import { BaseEntity } from '../../../common/entities/base.entity';
import { Product } from '../../../modules/product/entities/product.entity';
import { File } from '../../../modules/file/entities/file.entity';

@Entity('product_images')
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

  @ManyToOne(() => File, (file) => file.productImageFiles, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'fileId' })
  file: File;
}
