import {
  Entity,
  Column,
  ManyToOne,
  JoinColumn,
  Index,
  OneToOne,
  BeforeInsert,
  BeforeUpdate,
  OneToMany,
} from 'typeorm';
import { BaseEntity } from '../../../common/entities/base.entity';
import {
  PaymentMethod,
  PaymentStatus,
} from '../../../common/enums/product.enum';
import { Order } from '../../../modules/order/entities/order.entity';
import { DecimalColumn } from '../../../common/decorator/decimal-column.decorator';
import { Transaction } from '../../../modules/transaction/entities/transaction.entity';
import { randomUUID } from 'crypto';

@Entity('payments')
export class Payment extends BaseEntity {
  @Column()
  orderId: string;

  @ManyToOne(() => Order, (order) => order.payments, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'orderId' })
  order: Order;

  @Column({
    name: 'payment_method',
    type: 'enum',
    enum: PaymentMethod,
  })
  paymentMethod: PaymentMethod;

  @Column({
    name: 'status',
    type: 'enum',
    enum: PaymentStatus,
    default: PaymentStatus.PENDING,
  })
  status: PaymentStatus;

  @DecimalColumn()
  amount: number;

  @OneToMany(() => Transaction, (transaction) => transaction.payment)
  transactions: Transaction[];

  @Column({ name: 'payment_gateway' })
  paymentGateway: string;

  @Column({ name: 'paid_at', type: 'timestamptz', nullable: true })
  paidAt?: Date;

  @Column({ name: 'refunded_at', type: 'timestamptz', nullable: true })
  refundedAt?: Date;

  @Column({ unique: true })
  @Index()
  idempotencyKey: string;

  @BeforeUpdate()
  setIdempotency() {
    if (this.status === PaymentStatus.PAID) {
      this.idempotencyKey = randomUUID();
    }
  }
}
