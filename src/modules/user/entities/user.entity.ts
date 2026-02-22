import { Entity, Column, OneToOne, OneToMany, JoinColumn } from 'typeorm';
import { Exclude } from 'class-transformer';
import { BaseEntity } from '../../../common/entities/base.entity';
import { UserRole, UserStatus } from '../../../common/enums/user.enum';
import { UserPreferences } from '../../../modules/user-preferences/entities/user-preference.entity';
import { Address } from '../../../modules/address/entities/address.entity';
import { Cart } from '../../../modules/cart/entities/cart.entity';
import { Order } from '../../../modules/order/entities/order.entity';
import { Review } from '../../../modules/review/entities/review.entity';
import { Wishlist } from '../../../modules/wishlist/entities/wishlist.entity';
import { Notification } from '../../../modules/notification/entities/notification.entity';
import { InventoryLog } from '../../../modules/inventory-log/entities/inventory-log.entity';
import { ContactUs } from '../../../modules/contact-us/entities/contact-us.entity';
import { File } from '../../../modules/file/entities/file.entity';

@Entity('users')
export class User extends BaseEntity {
  @Column({ type: 'uuid', nullable: true })
  profileId?: string;

  @OneToOne(() => File, { nullable: true })
  @JoinColumn({ name: 'profileId' })
  profile?: File;

  @Column({ unique: true })
  email: string;

  @Column({ nullable: true })
  @Exclude()
  password: string;

  @Column({ name: 'full_name', nullable: true })
  fullName?: string;

  @Column({ name: 'phone_number', nullable: true })
  phoneNumber: string;

  @Column({ type: 'enum', enum: UserRole, default: UserRole.CUSTOMER })
  role: UserRole;

  @Column({ type: 'enum', enum: UserStatus, default: UserStatus.ACTIVE })
  status: UserStatus;

  @Column({ name: 'verified_at', type: 'timestamptz', nullable: true })
  verifiedAt?: Date;

  @Column({ name: 'last_login_at', type: 'timestamptz', nullable: true })
  lastLoginAt?: Date;

  @Column({ nullable: true })
  googleId: string;

  @Column({ nullable: true })
  provider: string;

  // Relations
  @OneToOne(() => UserPreferences, (preferences) => preferences.user, {
    cascade: true,
  })
  preferences?: UserPreferences;

  @OneToMany(() => Address, (address) => address.user)
  addresses?: Address[];

  @OneToMany(() => Cart, (cart) => cart.user)
  carts?: Cart[];

  @OneToMany(() => Order, (order) => order.user)
  orders?: Order[];

  @OneToMany(() => Review, (review) => review.user)
  reviews?: Review[];

  @OneToMany(() => Wishlist, (wishlist) => wishlist.user)
  wishlists?: Wishlist[];

  @OneToMany(() => Notification, (notification) => notification.user)
  notifications?: Notification[];

  @OneToMany(() => InventoryLog, (log) => log.createdByUser)
  inventoryLogs?: InventoryLog[];

  @OneToMany(() => ContactUs, (contact) => contact.user)
  contactSubmissions?: ContactUs[];

  @OneToMany(() => ContactUs, (contact) => contact.respondedByUser)
  respondedContacts?: ContactUs[];
}
