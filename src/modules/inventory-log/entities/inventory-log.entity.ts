import { Entity, Column, ManyToOne, JoinColumn, Index } from 'typeorm';
import { IsEnum, IsInt, IsOptional, IsString } from 'class-validator';
import { BaseEntity } from '../../../common/entities/base.entity';
import { InventoryChangeType } from '../../../common/enums/product.enum';
import { Product } from '../../../modules/product/entities/product.entity';
import { ProductVariant } from '../../../modules/product-variant/entities/product-variant.entity';
import { User } from '../../../modules/user/entities/user.entity';

@Entity('inventory_log')
@Index(['productId', 'createdAt'])
@Index(['referenceId'])
export class InventoryLog extends BaseEntity {
  @Column()
  productId: string;

  @ManyToOne(() => Product, (product) => product.inventoryLogs, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'productId' })
  product: Product;

  @Column({ type: 'uuid', nullable: true })
  @IsOptional()
  variantId?: string;

  @ManyToOne(() => ProductVariant, { nullable: true })
  @JoinColumn({ name: 'variantId' })
  variant?: ProductVariant;

  @Column({
    name: 'change_type',
    type: 'enum',
    enum: InventoryChangeType,
  })
  @IsEnum(InventoryChangeType)
  changeType: InventoryChangeType;

  @Column({ name: 'quantity_change' })
  @IsInt()
  quantityChange: number;

  @Column({ name: 'new_stock_quantity' })
  @IsInt()
  newStockQuantity: number;

  @Column({ name: 'reference_id', type: 'uuid', nullable: true })
  @IsOptional()
  referenceId?: string;

  @Column('text', { nullable: true })
  @IsOptional()
  @IsString()
  notes?: string;

  @Column({ name: 'created_by' })
  createdBy: string;

  @ManyToOne(() => User)
  @JoinColumn({ name: 'createdBy' })
  createdByUser: User;
}
