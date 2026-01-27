import { roleEnum } from 'src/common/enums/role.enum';
import { statusEnum } from 'src/common/enums/status.enum';
import {
  Column,
  CreateDateColumn,
  DeleteDateColumn,
  Entity,
  OneToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { PasswordResetToken } from '../passwordResetToken/passwordResetToken.entity';
import { EmailVerificationToken } from '../emailVerificationToken/emailVerification.entity';

@Entity('users')
export class User {
  @PrimaryGeneratedColumn('uuid')
  userId: string;

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
    nullable: false,
  })
  fullName: string;

  @Column({
    unique: true,
    nullable: false,
  })
  phoneNumber: string;

  @Column({
    type: 'enum',
    enum: roleEnum,
    default: roleEnum.CUSTOMER,
    nullable: false,
  })
  role: roleEnum;

  @Column({
    type: 'enum',
    enum: statusEnum,
    default: statusEnum.ACTIVE,
    nullable: false,
  })
  status: statusEnum;

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
}
