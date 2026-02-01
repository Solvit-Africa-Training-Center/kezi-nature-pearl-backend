import { Subject } from 'rxjs';
import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
} from 'typeorm';

@Entity('contactus')
export class Contact {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  name: string;

  @Column()
  phone_number: string;

  @Column()
  email:string;

  @Column()
  subject: string


  @Column()
  message: string;

  @CreateDateColumn()
  created_at: Date;
}
