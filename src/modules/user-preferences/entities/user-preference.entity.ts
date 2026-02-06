import { Entity, Column, OneToOne, JoinColumn } from 'typeorm';
import { IsEnum, IsOptional, IsArray, IsString } from 'class-validator';
import { BaseEntity } from '../../../common/entities/base.entity';
import { SkinType } from '../../../common/enums/user.enum';
import { User } from '../../../modules/user/entities/user.entity';

@Entity('user_preferences')
export class UserPreferences extends BaseEntity {
  @Column({ unique: true })
  userId: string;

  @OneToOne(() => User, (user) => user.preferences, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'userId' })
  user: User;

  @Column({
    name: 'skin_type',
    type: 'enum',
    enum: SkinType,
    nullable: true,
  })
  @IsEnum(SkinType)
  @IsOptional()
  skinType?: SkinType;

  @Column({ name: 'skin_tone', nullable: true })
  @IsOptional()
  @IsString()
  skinTone?: string;

  @Column('jsonb', { nullable: true })
  @IsOptional()
  @IsArray()
  allergies?: string[];

  @Column('uuid', { name: 'preferred_categories', array: true, nullable: true })
  @IsOptional()
  @IsArray()
  preferredCategories?: string[];
}
