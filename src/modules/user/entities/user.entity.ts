import {
  Entity,
  Column,
  OneToOne,
  OneToMany,
  JoinColumn,
  BeforeInsert,
  BeforeUpdate,
} from 'typeorm';
import { Exclude } from 'class-transformer';
import { IsEmail, IsEnum, IsOptional, IsString, Length } from 'class-validator';
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
import { comparehashContent, hashContent } from '../../../util/lib';

@Entity('users')
export class User extends BaseEntity {
  @Column({ type: 'uuid', nullable: true })
  profileId?: string;

  @OneToOne(() => File, { nullable: true })
  @JoinColumn({ name: 'profileId' })
  profile?: File;

  @Column({ unique: true })
  @IsEmail()
  email: string;

  @Column()
  @Exclude()
  @IsString()
  @Length(6, 100)
  password: string;

  @Column({ name: 'full_name', nullable: true })
  @IsOptional()
  @IsString()
  fullName?: string;

  @Column({ name: 'phone_number', nullable: true })
  @IsOptional()
  @IsString()
  phoneNumber?: string;

  @Column({ type: 'enum', enum: UserRole, default: UserRole.CUSTOMER })
  @IsEnum(UserRole)
  role: UserRole;

  @Column({ type: 'enum', enum: UserStatus, default: UserStatus.ACTIVE })
  @IsEnum(UserStatus)
  status: UserStatus;

  @Column({ name: 'verified_at', type: 'timestamptz', nullable: true })
  verifiedAt?: Date;

  @Column({ name: 'last_login_at', type: 'timestamptz', nullable: true })
  lastLoginAt?: Date;

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

  // Hooks
  @BeforeInsert()
  @BeforeUpdate()
  async hashPassword() {
    if (this.password) {
      this.password = hashContent(this.password, 10);
    }
  }

  async validatePassword(password: string): Promise<boolean> {
    return comparehashContent(password, this.password);
  }
}
