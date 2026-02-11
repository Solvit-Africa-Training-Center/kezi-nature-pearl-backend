import { Entity, Column, OneToMany, Index } from 'typeorm';
import {
  IsBoolean,
  IsDate,
  IsEnum,
  IsInt,
  IsNumber,
  IsString,
  Min,
  IsArray,
  IsOptional,
} from 'class-validator';
import { BaseEntity } from '../../../common/entities/base.entity';
import { DiscountType } from '../../../common/enums/product.enum';
import { DecimalColumn } from '../../../common/decorator/decimal-column.decorator';
import { OrderCoupon } from '../../../modules/order-coupon/entities/order-coupon.entity';

@Entity('coupons')
@Index(['code'], { unique: true })
export class Coupon extends BaseEntity {
  @Column({ unique: true })
  @IsString()
  code: string;

  @Column({
    name: 'discount_type',
    type: 'enum',
    enum: DiscountType,
  })
  @IsEnum(DiscountType)
  discountType: DiscountType;

  @DecimalColumn({ name: 'discount_value' })
  @IsNumber()
  @Min(0)
  discountValue: number;

  @DecimalColumn({ name: 'min_order_amount', nullable: true })
  @IsOptional()
  @IsNumber()
  @Min(0)
  minOrderAmount?: number;

  @DecimalColumn({ name: 'max_discount_amount', nullable: true })
  @IsOptional()
  @IsNumber()
  @Min(0)
  maxDiscountAmount?: number;

  @Column({ name: 'usage_limit', nullable: true })
  @IsOptional()
  @IsInt()
  @Min(1)
  usageLimit?: number;

  @Column({ name: 'used_count', default: 0 })
  @IsInt()
  @Min(0)
  usedCount: number;

  @Column({ name: 'valid_from', type: 'timestamptz' })
  @IsDate()
  validFrom: Date;

  @Column({ name: 'valid_until', type: 'timestamptz' })
  @IsDate()
  validUntil: Date;

  @Column({ name: 'is_active', default: true })
  @IsBoolean()
  isActive: boolean;

  @Column('uuid', {
    name: 'applicable_categories',
    array: true,
    nullable: true,
  })
  @IsOptional()
  @IsArray()
  applicableCategories?: string[];

  // Relations
  @OneToMany(() => OrderCoupon, (orderCoupon) => orderCoupon.coupon)
  orderCoupons?: OrderCoupon[];

  // Helper methods
  get isExpired(): boolean {
    return new Date() > this.validUntil;
  }

  get isActiveNow(): boolean {
    const now = new Date();
    return (
      this.isActive &&
      now >= this.validFrom &&
      now <= this.validUntil &&
      (!this.usageLimit || this.usedCount < this.usageLimit)
    );
  }

  calculateDiscount(amount: number): number {
    if (!this.isActiveNow) return 0;
    if (this.minOrderAmount && amount < this.minOrderAmount) return 0;

    let discount = 0;
    if (this.discountType === DiscountType.PERCENTAGE) {
      discount = (amount * this.discountValue) / 100;
      if (this.maxDiscountAmount && discount > this.maxDiscountAmount) {
        discount = this.maxDiscountAmount;
      }
    } else {
      discount = this.discountValue;
    }

    return Math.min(discount, amount);
  }

  incrementUsage(): void {
    this.usedCount += 1;
  }

  canBeApplied(totalAmount: number): boolean {
    if (!this.isActiveNow) return false;
    if (this.minOrderAmount && totalAmount < this.minOrderAmount) return false;
    if (this.usageLimit && this.usedCount >= this.usageLimit) return false;
    return true;
  }
}
