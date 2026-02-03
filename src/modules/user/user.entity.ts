import { userRoleEnum } from '@/common/enums/userRole.enum';
import { userStatusEnum } from '@/common/enums/userStatus.enum';
import {
  Column,
  CreateDateColumn,
  DeleteDateColumn,
  Entity,
  JoinColumn,
  OneToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { EmailVerificationToken } from '../emailVerificationToken/emailVerification.entity';
import { PasswordResetToken } from '../passwordResetToken/passwordResetToken.entity';
import { File } from '../file/entities/file.entity';

@Entity('users')
export class User {
  @PrimaryGeneratedColumn('uuid')
  userId: string;

  @Column({ nullable: true })
  profile: string;

  @Column({
    unique: true,
    nullable: false,
  })
  email: string;

  @Column({
    nullable: false,
  })
  password: string;

  @Column({
    nullable: true,
  })
  fullName: string;

  @Column({
    unique: true,
    nullable: false,
  })
  phoneNumber: string;

  @Column({
    type: 'enum',
    enum: userRoleEnum,
    default: userRoleEnum.CUSTOMER,
    nullable: false,
  })
  role: userRoleEnum;

  @Column({
    type: 'enum',
    enum: userStatusEnum,
    default: userStatusEnum.ACTIVE,
    nullable: false,
  })
  status: userStatusEnum;

  @Column({ nullable: true })
  emailVerifiedAt: Date;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @DeleteDateColumn()
  deletedAt: Date;

  @OneToOne(
    () => PasswordResetToken,
    (passwordresettoken) => passwordresettoken.user,
  )
  passwordresettoken: PasswordResetToken;

  @OneToOne(
    () => EmailVerificationToken,
    (emailverificationtoken) => emailverificationtoken.user,
  )
  emailverificationtoken: EmailVerificationToken;

  @OneToOne(() => File, (file) => file.user, { onDelete: 'SET NULL' })
  @JoinColumn({ name: 'profile' })
  file: File;
}
