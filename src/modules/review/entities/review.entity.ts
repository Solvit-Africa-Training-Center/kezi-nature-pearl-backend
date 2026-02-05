import { Entity, Column, ManyToOne, JoinColumn } from 'typeorm';
import {
  IsBoolean,
  IsEnum,
  IsInt,
  IsOptional,
  IsString,
  Max,
  Min,
} from 'class-validator';
import { BaseEntity } from '../../../common/entities/base.entity';
import { ReviewStatus } from '../../../common/enums/product.enum';
import { SkinType } from '../../../common/enums/user.enum';
import { User } from '../../../modules/user/entities/user.entity';
import { Product } from '../../../modules/product/entities/product.entity';
import { Order } from '../../../modules/order/entities/order.entity';

@Entity('reviews')
export class Review extends BaseEntity {
  @Column()
  userId: string;

  @ManyToOne(() => User, (user) => user.reviews)
  @JoinColumn({ name: 'userId' })
  user: User;

  @Column()
  productId: string;

  @ManyToOne(() => Product, (product) => product.reviews, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'productId' })
  product: Product;

  @Column({ type: 'uuid', nullable: true })
  orderId?: string;

  @ManyToOne(() => Order, { nullable: true })
  @JoinColumn({ name: 'orderId' })
  order?: Order;

  @Column('int')
  @IsInt()
  @Min(1)
  @Max(5)
  rating: number;

  @Column({ nullable: true })
  @IsOptional()
  @IsString()
  title?: string;

  @Column('text', { nullable: true })
  @IsOptional()
  @IsString()
  comment?: string;

  @Column({ name: 'is_verified_purchase', default: false })
  @IsBoolean()
  isVerifiedPurchase: boolean;

  @Column({
    type: 'enum',
    enum: SkinType,
    nullable: true,
  })
  @IsEnum(SkinType)
  @IsOptional()
  skinType?: SkinType;

  @Column({ name: 'helpful_count', default: 0 })
  @IsInt()
  @Min(0)
  helpfulCount: number;

  @Column({
    type: 'enum',
    enum: ReviewStatus,
    default: ReviewStatus.PENDING,
  })
  @IsEnum(ReviewStatus)
  status: ReviewStatus;
}
