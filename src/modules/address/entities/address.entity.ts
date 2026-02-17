import { Entity, Column, ManyToOne, JoinColumn, OneToMany } from 'typeorm';
import { BaseEntity } from '../../../common/entities/base.entity';
import { User } from '../../../modules/user/entities/user.entity';

@Entity('addresses')
export class Address extends BaseEntity {
  @Column()
  userId: string;

  @ManyToOne(() => User, (user) => user.addresses, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'userId' })
  user: User;

  @Column()
  fullName: string;

  @Column({ name: 'phone_number' })
  phoneNumber: string;

  @Column()
  country: string;

  @Column({ nullable: true })
  state?: string;

  @Column({ nullable: true })
  city?: string;

  @Column({ nullable: true })
  province?: string;

  @Column({ nullable: true })
  district?: string;

  @Column({ nullable: true })
  sector?: string;

  @Column({ name: 'address_line1', nullable: true })
  addressLine1?: string;

  @Column({ name: 'postal_code', nullable: true })
  postalCode?: string;

  @Column({ name: 'is_default', default: false })
  isDefault: boolean;
}
