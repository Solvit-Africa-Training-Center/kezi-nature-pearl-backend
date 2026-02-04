import {
  Column,
  CreateDateColumn,
  Entity,
  OneToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { User } from '../user/user.entity';
import { tokenTypeEnum } from '@/common/enums/tokenType.enum';

@Entity('passwordresettoken')
export class PasswordResetToken {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  userId: string;

  @Column()
  token: string;

  @Column()
  expiresAt: Date;

  @Column()
  type: tokenTypeEnum;

  @CreateDateColumn()
  createdAt: Date;

  @OneToOne(() => User, (user) => user.passwordresettoken)
  user: User;
}
