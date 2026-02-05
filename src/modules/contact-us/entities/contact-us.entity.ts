import { Entity, Column, ManyToOne, JoinColumn } from 'typeorm';
import { IsEnum, IsOptional, IsString } from 'class-validator';
import { BaseEntity } from '../../../common/entities/base.entity';
import { ContactUsStatus } from '../../../common/enums/product.enum';
import { User } from '../../../modules/user/entities/user.entity';

@Entity('contact_us')
export class ContactUs extends BaseEntity {
  @Column({ type: 'uuid', nullable: true })
  userId?: string;

  @ManyToOne(() => User, (user) => user.contactSubmissions, {
    nullable: true,
  })
  @JoinColumn({ name: 'userId' })
  user?: User;

  @Column()
  @IsString()
  name: string;

  @Column()
  @IsString()
  email: string;

  @Column({ nullable: true })
  @IsOptional()
  @IsString()
  phone?: string;

  @Column()
  @IsString()
  subject: string;

  @Column('text')
  @IsString()
  message: string;

  @Column({
    type: 'enum',
    enum: ContactUsStatus,
    default: ContactUsStatus.NEW,
  })
  @IsEnum(ContactUsStatus)
  status: ContactUsStatus;

  @Column('text', { nullable: true })
  @IsOptional()
  @IsString()
  response?: string;

  @Column({ type: 'uuid', nullable: true })
  respondedBy?: string;

  @ManyToOne(() => User, { nullable: true })
  @JoinColumn({ name: 'respondedBy' })
  respondedByUser?: User;

  @Column({ name: 'responded_at', type: 'timestamptz', nullable: true })
  respondedAt?: Date;
}
