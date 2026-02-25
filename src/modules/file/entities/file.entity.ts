import { Entity, Column, OneToMany } from 'typeorm';
import { BaseEntity } from '../../../common/entities/base.entity';
import { FileType } from '../../../common/enums/product.enum';
import { User } from '../../../modules/user/entities/user.entity';
import { Category } from '../../../modules/category/entities/category.entity';
import { ProductImage } from '../../../modules/product-image/entities/product-image.entity';

@Entity('files')
export class File extends BaseEntity {
  @Column()
  name: string;

  @Column()
  url: string;

  @Column({ type: 'enum', enum: FileType })
  type: FileType;

  @Column({ name: 'mime_type' })
  mimeType: string;

  @Column('int')
  size: number;

  // Relations
  @OneToMany(() => User, (user) => user.profile, { onDelete: 'CASCADE' })
  userProfiles?: User[];

  @OneToMany(() => Category, (category) => category.image, {
    onDelete: 'CASCADE',
  })
  categoryImages?: Category[];

  @OneToMany(() => ProductImage, (productImage) => productImage.file, {
    onDelete: 'CASCADE',
  })
  productImageFiles?: ProductImage[];
}
