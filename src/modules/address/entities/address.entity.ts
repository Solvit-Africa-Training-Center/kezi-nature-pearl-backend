import { Entity, Column, ManyToOne, JoinColumn, OneToMany } from 'typeorm';
import { IsBoolean, IsEnum, IsOptional, IsString } from 'class-validator';
import { BaseEntity } from '../../../common/entities/base.entity';
import { User } from '../../../modules/user/entities/user.entity';
import { AddressType } from '../../../common/enums/user.enum';

@Entity('addresses')
export class Address extends BaseEntity {
  @Column({ type: 'enum', enum: AddressType })
  type: AddressType;

  @Column()
  userId: string;

  @ManyToOne(() => User, (user) => user.addresses, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'userId' })
  user: User;

  @Column()
  fullName: string;

  @Column({ name: 'phone_number' })
  phoneNumber: string;

  @Column({ name: 'address_line1' })
  @IsString()
  addressLine1: string;

  @Column({ name: 'address_line2', nullable: true })
  @IsOptional()
  @IsString()
  addressLine2?: string;

  @Column()
  @IsString()
  country: string;

  @Column()
  @IsString()
  city: string;

  @Column()
  @IsString()
  state: string;

  @Column({ name: 'postal_code', nullable: true })
  @IsString()
  postalCode?: string;

  @Column({ name: 'is_default', default: false })
  @IsBoolean()
  isDefault: boolean;
}
