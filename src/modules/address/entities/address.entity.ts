import { Entity, Column, ManyToOne, JoinColumn, OneToMany } from 'typeorm';
import { IsBoolean, IsEnum, IsOptional, IsString } from 'class-validator';
import { BaseEntity } from '../../../common/entities/base.entity';
import { AddressLabel } from '../../../common/enums/user.enum';
import { User } from '../../../modules/user/entities/user.entity';
import { Order } from '../../../modules/order/entities/order.entity';

@Entity('addresses')
export class Address extends BaseEntity {
  @Column()
  userId: string;

  @ManyToOne(() => User, (user) => user.addresses, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'userId' })
  user: User;

  @Column({ name: 'address_line1' })
  @IsString()
  addressLine1: string;

  @Column({ name: 'address_line2', nullable: true })
  @IsOptional()
  @IsString()
  addressLine2?: string;

  @Column()
  @IsString()
  city: string;

  @Column()
  @IsString()
  state: string;

  @Column()
  @IsString()
  country: string;

  @Column({ name: 'postal_code' })
  @IsString()
  postalCode: string;

  @Column({ name: 'phone_number', nullable: true })
  @IsOptional()
  @IsString()
  phoneNumber?: string;

  @Column({ name: 'is_default', default: false })
  @IsBoolean()
  isDefault: boolean;

  @Column({ type: 'enum', enum: AddressLabel, default: AddressLabel.HOME })
  @IsEnum(AddressLabel)
  label: AddressLabel;

  // Relations
  @OneToMany(() => Order, (order) => order.shippingAddress)
  shippingOrders?: Order[];
}
