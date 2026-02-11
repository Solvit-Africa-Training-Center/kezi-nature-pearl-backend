import {
  Entity,
  Column,
  ManyToOne,
  OneToMany,
  JoinColumn,
  BeforeUpdate,
} from 'typeorm';
import { BaseEntity } from '../../../common/entities/base.entity';
import { ProductStatus } from '../../../common/enums/product.enum';
import { Category } from '../../../modules/category/entities/category.entity';
import { DecimalColumn } from '../../../common/decorator/decimal-column.decorator';
import { ProductImage } from '../../../modules/product-image/entities/product-image.entity';
import { CartItem } from '../../../modules/cart-item/entities/cart-item.entity';
import { OrderItem } from '../../../modules/order-item/entities/order-item.entity';
import { Wishlist } from '../../../modules/wishlist/entities/wishlist.entity';
import { Review } from '../../../modules/review/entities/review.entity';
import { InventoryLog } from '../../../modules/inventory-log/entities/inventory-log.entity';

@Entity('products')
export class Product extends BaseEntity {
  @Column()
  name: string;

  @Column('text', { nullable: true })
  description?: string;

  @Column({ type: 'uuid', nullable: true })
  categoryId: string;

  @ManyToOne(() => Category, (category) => category.products, {
    onDelete: 'SET NULL',
  })
  @JoinColumn({ name: 'categoryId' })
  category: Category;

  @DecimalColumn()
  price: number;

  @DecimalColumn({ name: 'sale_price', nullable: true })
  salePrice?: number;

  @DecimalColumn({ name: 'cost_price', nullable: true })
  costPrice?: number;

  @Column({ name: 'stock_quantity', default: 0 })
  stockQuantity: number;

  @Column({
    name: 'low_stock_threshold',
    default: 10,
  })
  lowStockThreshold: number;

  @DecimalColumn({ nullable: true })
  weight?: number;

  @Column('text', { nullable: true })
  ingredients: string;

  @Column({
    type: 'enum',
    enum: ProductStatus,
    default: ProductStatus.DRAFT,
  })
  status: ProductStatus;

  // Relations

  @OneToMany(() => ProductImage, (productImage) => productImage.product, {})
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
}
