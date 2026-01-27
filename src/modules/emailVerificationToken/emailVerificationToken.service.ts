import { Injectable, NotFoundException } from '@nestjs/common';
import { Repository } from 'typeorm';
import { EmailVerificationToken } from './emailVerification.entity';
import { InjectRepository } from '@nestjs/typeorm';
import {
  CreateEmailVerificationTokenDTO,
  UpdateEmailVerificationTokenDTO,
} from './emailVerification.dto';

@Injectable()
export class EmailverificationTokenService {
  constructor(
    @InjectRepository(EmailVerificationToken)
    private readonly emailVerificationTokenRepository: Repository<EmailVerificationToken>,
  ) {}

  async create(
    dto: CreateEmailVerificationTokenDTO,
  ): Promise<EmailVerificationToken> {
    const token = this.emailVerificationTokenRepository.create(dto);
    return await this.emailVerificationTokenRepository.save(token);
  }

  async findOne(
    filters?: Partial<EmailVerificationToken>,
  ): Promise<EmailVerificationToken | null> {
    return await this.emailVerificationTokenRepository.findOne({
      where: { ...filters },
    });
  }

  async update(
    id: string,
    dto: UpdateEmailVerificationTokenDTO,
  ): Promise<EmailVerificationToken> {
    const entity = await this.emailVerificationTokenRepository.preload({
      id,
      ...dto,
    });

    if (!entity) {
      throw new NotFoundException('Token not found');
    }

    return this.emailVerificationTokenRepository.save(entity);
  }

  async delete(id: string): Promise<void> {
    await this.emailVerificationTokenRepository.delete(id);
  }
}
