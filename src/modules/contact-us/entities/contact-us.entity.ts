import { Entity, Column, ManyToOne, JoinColumn, Index } from 'typeorm';
import { BaseEntity } from '../../../common/entities/base.entity';
import { ContactUsStatus } from '../../../common/enums/product.enum';
import { User } from '../../../modules/user/entities/user.entity';

export enum ContactSubjectEnum {
  GENERAL_INQUIRY = 'General Inquiry',
  SUPPORT = 'Support',
  FEEDBACK = 'Feedback',
  TESTIMONY = 'Testimony',
}

@Entity('contact_us')
export class ContactUs extends BaseEntity {
  @Column({ type: 'uuid', nullable: true })
  userId: string | null = null;

  @ManyToOne(() => User, (user) => user.contactSubmissions, { nullable: true })
  @JoinColumn({ name: 'userId' })
  user: User | null = null;

  @Column({ type: 'uuid', nullable: true })
  guestId: string | null = null;

  @Column({ nullable: true })
  name: string;

  @Column()
  email: string;

  @Column({
    type: 'enum',
    enum: ContactSubjectEnum,
    default: ContactSubjectEnum.SUPPORT,
  })
  subject: ContactSubjectEnum;

  @Column('text')
  message: string;

  @Column({
    type: 'enum',
    enum: ContactUsStatus,
    default: ContactUsStatus.NEW,
  })
  status: ContactUsStatus;

  @Column('text', { nullable: true })
  response: string;

  @Column({ type: 'uuid', nullable: true })
  respondedBy: string;

  @ManyToOne(() => User, { nullable: true })
  @JoinColumn({ name: 'respondedBy' })
  respondedByUser: User;

  @Column({ name: 'responded_at', type: 'timestamptz', nullable: true })
  respondedAt: Date;
}
