import {
  Entity,
  Column,
  ManyToOne,
  OneToMany,
  JoinColumn,
  Index,
  BeforeUpdate,
} from 'typeorm';
import {
  IsEnum,
  IsInt,
  IsNumber,
  IsOptional,
  IsString,
  IsArray,
  Min,
  IsDecimal,
} from 'class-validator';
import { BaseEntity } from '../../../common/entities/base.entity';
import { ProductStatus } from '../../../common/enums/product.enum';
import { Brand } from '../../../modules/brand/entities/brand.entity';
import { Category } from '../../../modules/category/entities/category.entity';
import { DecimalColumn } from '../../../common/decorator/decimal-column.decorator';
import { ProductVariant } from '../../../modules/product-variant/entities/product-variant.entity';
import { ProductImage } from '../../../modules/product-image/entities/product-image.entity';
import { CartItem } from '../../../modules/cart-item/entities/cart-item.entity';
import { OrderItem } from '../../../modules/order-item/entities/order-item.entity';
import { Wishlist } from '../../../modules/wishlist/entities/wishlist.entity';
import { Review } from '../../../modules/review/entities/review.entity';
import { InventoryLog } from '../../../modules/inventory-log/entities/inventory-log.entity';
import { File } from '../../../modules/file/entities/file.entity';

@Entity('products')
@Index(['slug'], { unique: true })
@Index(['sku'], { unique: true })
export class Product extends BaseEntity {
  @Column({ type: 'uuid', nullable: true })
  imageId?: string;

  @ManyToOne(() => File, { nullable: true })
  @JoinColumn({ name: 'imageId' })
  image?: File;

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

  @Column({ name: 'short_description', nullable: true })
  @IsOptional()
  @IsString()
  shortDescription?: string;

  @Column({ unique: true })
  @IsString()
  sku: string;

  @Column({ type: 'uuid', nullable: true })
  brandId?: string;

  @ManyToOne(() => Brand, (brand) => brand.products, { nullable: true })
  @JoinColumn({ name: 'brandId' })
  brand?: Brand;

  @Column({ type: 'uuid' })
  categoryId: string;

  @ManyToOne(() => Category, (category) => category.products)
  @JoinColumn({ name: 'categoryId' })
  category: Category;

  @DecimalColumn()
  @IsNumber()
  @Min(0)
  price: number;

  @DecimalColumn({ name: 'sale_price', nullable: true })
  @IsOptional()
  @IsNumber()
  @Min(0)
  salePrice?: number;

  @DecimalColumn({ name: 'cost_price', nullable: true })
  @IsOptional()
  @IsNumber()
  @Min(0)
  costPrice?: number;

  @Column({ name: 'stock_quantity', default: 0 })
  @IsInt()
  @Min(0)
  stockQuantity: number;

  @Column({
    name: 'low_stock_threshold',
    default: 10,
  })
  @IsInt()
  @Min(0)
  lowStockThreshold: number;

  @DecimalColumn({ nullable: true })
  @IsOptional()
  @IsNumber()
  @Min(0)
  weight?: number;

  @Column({ nullable: true })
  @IsOptional()
  @IsString()
  volume?: string;

  @Column({ name: 'expiry_duration', nullable: true })
  @IsOptional()
  @IsInt()
  expiryDuration?: number;

  @Column('text', { nullable: true })
  @IsOptional()
  @IsString()
  ingredients?: string;

  @Column('text', { array: true, nullable: true })
  @IsOptional()
  @IsArray()
  benefits?: string[];

  @Column({ name: 'how_to_use', type: 'text', nullable: true })
  @IsOptional()
  @IsString()
  howToUse?: string;

  @Column({
    type: 'enum',
    enum: ProductStatus,
    default: ProductStatus.DRAFT,
  })
  @IsEnum(ProductStatus)
  status: ProductStatus;

  // Relations
  @OneToMany(() => ProductVariant, (variant) => variant.product, {
    cascade: true,
  })
  variants?: ProductVariant[];

  @OneToMany(() => ProductImage, (productImage) => productImage.product, {
    cascade: true,
  })
  images?: ProductImage[];

  @OneToMany(() => CartItem, (cartItem) => cartItem.product)
  cartItems?: CartItem[];

  @OneToMany(() => OrderItem, (orderItem) => orderItem.product)
  orderItems?: OrderItem[];

  @OneToMany(() => Wishlist, (wishlist) => wishlist.product)
  wishlists?: Wishlist[];

  @OneToMany(() => Review, (review) => review.product)
  reviews?: Review[];

  @OneToMany(() => InventoryLog, (log) => log.product)
  inventoryLogs?: InventoryLog[];

  @BeforeUpdate()
  updateStatusBasedOnStock() {
    if (
      this.stockQuantity === 0 &&
      this.status !== ProductStatus.DISCONTINUED
    ) {
      this.status = ProductStatus.OUT_OF_STOCK;
    }
  }

  // Helper methods
  get isLowStock(): boolean {
    return this.stockQuantity <= this.lowStockThreshold;
  }

  get isOutOfStock(): boolean {
    return this.stockQuantity === 0;
  }

  get currentPrice(): number {
    return this.salePrice || this.price;
  }

  get hasActiveVariants(): boolean {
    return this.variants?.some((v) => v.isActive) || false;
  }
}
