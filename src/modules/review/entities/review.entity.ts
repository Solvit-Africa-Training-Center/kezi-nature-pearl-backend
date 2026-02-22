import { Entity, Column, ManyToOne, JoinColumn } from 'typeorm';
import {
  IsBoolean,
  IsInt,
  IsOptional,
  IsString,
  Max,
  Min,
} from 'class-validator';
import { BaseEntity } from '../../../common/entities/base.entity';
import { User } from '../../../modules/user/entities/user.entity';
import { Product } from '../../../modules/product/entities/product.entity';

@Entity('reviews')
export class Review extends BaseEntity {
  @Column({ nullable: true })
  userId: string | null = null;

  @ManyToOne(() => User, (user) => user.reviews, { nullable: true })
  @JoinColumn({ name: 'userId' })
  user: User | null = null;

  @Column({ type: 'uuid', nullable: true })
  guestId: string | null = null;

  @Column()
  productId: string;

  @ManyToOne(() => Product, (product) => product.reviews, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'productId' })
  product: Product;

  @Column('int')
  @IsInt()
  @Min(1)
  @Max(5)
  rating: number;

  @Column('text', { nullable: true })
  @IsOptional()
  @IsString()
  comment: string;

  @Column({ name: 'is_verified_purchase', default: false })
  @IsBoolean()
  isVerifiedPurchase: boolean;

  // @Column({
  //   name: 'skin_type',
  //   type: 'enum',
  //   enum: SkinType,
  //   nullable: true,
  // })
  // @IsEnum(SkinType)
  // @IsOptional()
  // skinType?: SkinType;

  // @Column({ name: 'helpful_count', default: 0 })
  // @IsInt()
  // @Min(0)
  // helpfulCount: number;

  // @Column({
  //   type: 'enum',
  //   enum: ReviewStatus,
  //   default: ReviewStatus.PENDING,
  // })
  // @IsEnum(ReviewStatus)
  // status: ReviewStatus;

  // Helper methods
  // get isApproved(): boolean {
  //   return this.status === ReviewStatus.APPROVED;
  // }

  // get isPending(): boolean {
  //   return this.status === ReviewStatus.PENDING;
  // }

  // get isRejected(): boolean {
  //   return this.status === ReviewStatus.REJECTED;
  // }
}
