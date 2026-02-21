import {
  Entity,
  Column,
  ManyToOne,
  OneToMany,
  JoinColumn,
  BeforeUpdate,
} from 'typeorm';
import { BaseEntity } from '../../../common/entities/base.entity';
import { Category } from '../../../modules/category/entities/category.entity';
import { DecimalColumn } from '../../../common/decorator/decimal-column.decorator';
import { ProductImage } from '../../../modules/product-image/entities/product-image.entity';
import { Item } from '../../item/entities/item.entity';
import { Wishlist } from '../../../modules/wishlist/entities/wishlist.entity';
import { Review } from '../../../modules/review/entities/review.entity';
import { InventoryLog } from '../../../modules/inventory-log/entities/inventory-log.entity';

@Entity('products')
export class Product extends BaseEntity {
  @Column({ unique: true })
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

  @DecimalColumn({ name: 'old_price', nullable: true })
  oldPrice?: number;

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

  // Relations

  @OneToMany(() => ProductImage, (productImage) => productImage.product, {})
  images?: ProductImage[];

  @OneToMany(() => Item, (item) => item.product)
  items?: Item[];

  @OneToMany(() => Wishlist, (wishlist) => wishlist.product)
  wishlists?: Wishlist[];

  @OneToMany(() => Review, (review) => review.product)
  reviews?: Review[];

  @OneToMany(() => InventoryLog, (log) => log.product)
  inventoryLogs?: InventoryLog[];

  // @BeforeUpdate()
  // updateStatusBasedOnStock() {
  //   this.oldPrice = this.price;
  // }

  // Helper methods
  get isLowStock(): boolean {
    return this.stockQuantity <= this.lowStockThreshold;
  }

  get isOutOfStock(): boolean {
    return this.stockQuantity === 0;
  }
}
