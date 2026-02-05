import { Entity, Column, ManyToOne, JoinColumn, OneToMany } from 'typeorm';
import { IsBoolean, IsOptional, IsString } from 'class-validator';
import { BaseEntity } from '../../../common/entities/base.entity';
import { File } from '../../../modules/file/entities/file.entity';
import { Product } from '../../../modules/product/entities/product.entity';

@Entity('brands')
export class Brand extends BaseEntity {
  @Column()
  @IsString()
  name: string;

  @Column({ type: 'uuid', nullable: true })
  logoId?: string;

  @ManyToOne(() => File, { nullable: true })
  @JoinColumn({ name: 'logoId' })
  logo?: File;

  @Column('text', { nullable: true })
  @IsOptional()
  @IsString()
  description?: string;

  @Column({ name: 'is_active', default: true })
  @IsBoolean()
  isActive: boolean;

  // Relations
  @OneToMany(() => Product, (product) => product.brand)
  products?: Product[];
}
