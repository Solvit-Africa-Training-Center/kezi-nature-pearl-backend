import { Injectable, NotFoundException } from '@nestjs/common';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { PasswordResetToken } from './passwordResetToken.entity';
import {
  CreatePasswordResetTokenDTO,
  UpdatePasswordResetTokenDTO,
} from './passwordresettoken.dto';

@Injectable()
export class PasswordResetTokenService {
  constructor(
    @InjectRepository(PasswordResetToken)
    private readonly passwordResetTokenRepository: Repository<PasswordResetToken>,
  ) {}

  async create(dto: CreatePasswordResetTokenDTO): Promise<PasswordResetToken> {
    const token = this.passwordResetTokenRepository.create(dto);
    return await this.passwordResetTokenRepository.save(token);
  }

  async findOne(
    filters?: Partial<PasswordResetToken>,
  ): Promise<PasswordResetToken | null> {
    return await this.passwordResetTokenRepository.findOne({
      where: { ...filters },
    });
  }

  async update(
    id: string,
    dto: UpdatePasswordResetTokenDTO,
  ): Promise<PasswordResetToken> {
    const entity = await this.passwordResetTokenRepository.preload({
      id,
      ...dto,
    });

    if (!entity) {
      throw new NotFoundException('Token not found');
    }

    return this.passwordResetTokenRepository.save(entity);
  }

  async delete(id: string): Promise<void> {
    await this.passwordResetTokenRepository.delete(id);
  }
}
