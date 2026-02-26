import { Entity, Column, ManyToOne, JoinColumn } from 'typeorm';
import { BaseEntity } from '../../../common/entities/base.entity';
import { Payment } from '../../../modules/payment/entities/payment.entity';

export enum TransactionStatus {
  PENDING = 'pending',
  SUCCESS = 'success',
  FAILED = 'failed',
}

@Entity('transactions')
export class Transaction extends BaseEntity {
  @Column({ nullable: true })
  paymentId: string;

  @ManyToOne(() => Payment, (payment) => payment.transactions, {
    onDelete: 'SET NULL',
  })
  @JoinColumn({ name: 'paymentId' })
  payment: Payment;

  @Column({ unique: true })
  reference: string;

  @Column()
  kind: string;

  @Column('decimal', { precision: 10, scale: 2 })
  amount: number;

  @Column({
    type: 'enum',
    enum: TransactionStatus,
    default: TransactionStatus.PENDING,
  })
  status: TransactionStatus;

  @Column()
  provider: string;
}
