import { Entity, Column, ManyToOne, OneToMany, JoinColumn } from 'typeorm';
import { BaseEntity } from '../../../common/entities/base.entity';
import { User } from '../../../modules/user/entities/user.entity';
import { CartStatus } from '../../../common/enums/product.enum';
import { Item } from '../../item/entities/item.entity';

@Entity('carts')
export class Cart extends BaseEntity {
  @Column({ type: 'uuid', nullable: true })
  userId: string | null = null;

  @ManyToOne(() => User, (user) => user.carts, { nullable: true })
  @JoinColumn({ name: 'userId' })
  user: User | null = null;

  @Column({ type: 'uuid', nullable: true })
  guestId: string | null = null;

  @Column({
    type: 'enum',
    enum: CartStatus,
    default: CartStatus.ACTIVE,
  })
  status: CartStatus;

  @OneToMany(() => Item, (item) => item.cart)
  items: Item[];

  // // Helper methods
  // get totalItems(): number {
  //   return this.items?.reduce((sum, item) => sum + item.quantity, 0) || 0;
  // }

  // get subtotal(): number {
  //   return this.items?.reduce((sum, item) => sum + item.totalPrice, 0) || 0;
  // }

  // get isEmpty(): boolean {
  //   return !this.items || this.items.length === 0;
  // }

  // // Find specific item in cart
  // findItem(productId: string): CartItem | undefined {
  //   return this.items?.find((item) => item.productId === productId);
  // }

  // // Add item to cart (business logic)
  // addItem(productId: string, quantity: number, unitPrice: number): void {
  //   const existingItem = this.findItem(productId);

  //   if (existingItem) {
  //     existingItem.quantity += quantity;
  //   } else {
  //     const newItem = new CartItem();
  //     newItem.productId = productId;
  //     newItem.quantity = quantity;
  //     newItem.unitPrice = unitPrice;

  //     if (!this.items) this.items = [];
  //     this.items.push(newItem);
  //   }
  // }

  // // Update item quantity
  // updateItemQuantity(productId: string, quantity: number): void {
  //   const item = this.findItem(productId);
  //   if (!item) {
  //     throw new Error('Item not found in cart');
  //   }
  //   item.quantity = quantity;
  // }

  // // Remove item from cart
  // removeItem(productId: string): void {
  //   this.items = this.items?.filter((item) => item.productId !== productId);
  // }

  // // Clear cart
  // clear(): void {
  //   this.items = [];
  // }
}

// import { Entity, Column, ManyToOne, JoinColumn, OneToMany } from 'typeorm';
// import { BaseEntity } from '../../../common/entities/base.entity';
// import { CartStatus } from '../../../common/enums/product.enum';
// import { User } from '../../../modules/user/entities/user.entity';
// import { CartItem } from '../../../modules/cart-item/entities/cart-item.entity';

// @Entity('carts')
// export class Cart extends BaseEntity {
//   @Column()
//   userId: string;

//   @ManyToOne(() => User, (user) => user.carts)
//   @JoinColumn({ name: 'userId' })
//   user: User;

//   @Column({
//     type: 'enum',
//     enum: CartStatus,
//     default: CartStatus.ACTIVE,
//   })
//   status: CartStatus;

//   // Relations
//   @OneToMany(() => CartItem, (cartItem) => cartItem.cart, {
//     cascade: true,
//   })
//   items?: CartItem[];

//   // Helper methods
//   get totalItems(): number {
//     return this.items?.reduce((sum, item) => sum + item.quantity, 0) || 0;
//   }

//   get subtotal(): number {
//     return this.items?.reduce((sum, item) => sum + item.totalPrice, 0) || 0;
//   }

//   get isEmpty(): boolean {
//     return !this.items || this.items.length === 0;
//   }
// }
