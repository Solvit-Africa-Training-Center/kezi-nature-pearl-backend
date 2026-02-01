import { User } from '@/modules/user/user.entity';
import {
  Column,
  CreateDateColumn,
  Entity,
  OneToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';

@Entity('files')
export class File {
  @PrimaryGeneratedColumn('uuid')
  fileId: string;

  @Column()
  name: string;

  @Column({ unique: true })
  url: string;

  @Column()
  type: string;

  @Column()
  resourceType: string;

  @CreateDateColumn()
  createdAt: Date;

  @OneToOne(() => User, (user) => user.file)
  user: User;
}
