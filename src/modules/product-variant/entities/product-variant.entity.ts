import { Entity, Column, ManyToOne, JoinColumn, OneToMany } from 'typeorm';
import {
  IsBoolean,
  IsNumber,
  IsOptional,
  IsString,
  Min,
} from 'class-validator';
import { BaseEntity } from '../../../common/entities/base.entity';
import { Product } from '../../../modules/product/entities/product.entity';
import { DecimalColumn } from '../../../common/decorator/decimal-column.decorator';
import { CartItem } from '../../../modules/cart-item/entities/cart-item.entity';
import { OrderItem } from '../../../modules/order-item/entities/order-item.entity';
import { InventoryLog } from '../../../modules/inventory-log/entities/inventory-log.entity';
import { File } from '../../../modules/file/entities/file.entity';

@Entity('product_variants')
export class ProductVariant extends BaseEntity {
  @Column()
  productId: string;

  @ManyToOne(() => Product, (product) => product.variants, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'productId' })
  product: Product;

  @Column()
  @IsString()
  name: string;

  @Column({ unique: true })
  @IsString()
  sku: string;

  @DecimalColumn({ nullable: true })
  @IsOptional()
  @IsNumber()
  @Min(0)
  price?: number;

  @DecimalColumn({ name: 'sale_price', nullable: true })
  @IsOptional()
  @IsNumber()
  @Min(0)
  salePrice?: number;

  @Column({ name: 'stock_quantity', default: 0 })
  @IsNumber()
  @Min(0)
  stockQuantity: number;

  @Column('jsonb', { nullable: true })
  @IsOptional()
  attributes?: Record<string, any>;

  @Column({ type: 'uuid', nullable: true })
  imageId?: string;

  @ManyToOne(() => File, { nullable: true })
  @JoinColumn({ name: 'imageId' })
  image?: File;

  @Column({ name: 'is_active', default: true })
  @IsBoolean()
  isActive: boolean;

  @OneToMany(() => CartItem, (cartItem) => cartItem.variant)
  cartItems?: CartItem[];

  @OneToMany(() => OrderItem, (orderItem) => orderItem.variant)
  orderItems?: OrderItem[];

  @OneToMany(() => InventoryLog, (log) => log.variant)
  inventoryLogs?: InventoryLog[];
}
