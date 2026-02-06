import { Entity, Column, OneToMany } from 'typeorm';
import { IsEnum, IsInt, IsOptional, IsString, Min } from 'class-validator';
import { BaseEntity } from '../../../common/entities/base.entity';
import { FileType } from '../../../common/enums/product.enum';
import { User } from '../../../modules/user/entities/user.entity';
import { Category } from '../../../modules/category/entities/category.entity';
import { Brand } from '../../../modules/brand/entities/brand.entity';
import { Product } from '../../../modules/product/entities/product.entity';
import { ProductVariant } from '../../../modules/product-variant/entities/product-variant.entity';
import { ProductImage } from '../../../modules/product-image/entities/product-image.entity';

@Entity('files')
export class File extends BaseEntity {
  @Column()
  @IsString()
  url: string;

  @Column({ type: 'enum', enum: FileType })
  @IsEnum(FileType)
  type: FileType;

  @Column({ name: 'mime_type' })
  @IsString()
  mimeType: string;

  @Column('int')
  @IsInt()
  @Min(0)
  size: number;

  // Relations
  @OneToMany(() => User, (user) => user.profile)
  userProfiles?: User[];

  @OneToMany(() => Category, (category) => category.image)
  categoryImages?: Category[];

  @OneToMany(() => Brand, (brand) => brand.logo)
  brandLogos?: Brand[];

  @OneToMany(() => Product, (product) => product.image)
  productImages?: Product[];

  @OneToMany(() => ProductVariant, (variant) => variant.image)
  variantImages?: ProductVariant[];

  @OneToMany(() => ProductImage, (productImage) => productImage.file)
  productImageFiles?: ProductImage[];
}
