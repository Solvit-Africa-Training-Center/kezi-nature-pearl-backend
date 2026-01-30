import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { Repository } from 'typeorm';
import { User } from './user.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { CreateAdminDTO, UserIdDTO } from './user.dto';
import { comparehashContent } from 'src/util/lib';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User)
    private readonly userRepo: Repository<User>,
  ) {}

  async create(user: CreateAdminDTO) {
    return await this.userRepo.save(user);
  }

  async find(filter?: Partial<User>) {
    return await this.userRepo.find({ where: filter });
  }

  async findOne(filter: Partial<User>) {
    return await this.userRepo.findOne({
      where: filter,
      select: ['email', 'fullName', 'phoneNumber', 'profile'],
    });
  }

  async update(
    user: Partial<User>,
    options?: {
      currentPassword?: string;
      newPassword?: string;
    },
  ) {
    const exist = await this.findOne({ userId: user.userId });
    if (!exist) throw new NotFoundException('User not found.');

    exist.email = user.email ?? exist.email;
    exist.fullName = user.fullName ?? exist.fullName;
    exist.phoneNumber = user.phoneNumber ?? exist.phoneNumber;

    if (options) {
      if (options.currentPassword && options.newPassword) {
        if (!comparehashContent(exist.password, options.currentPassword))
          throw new BadRequestException('Current password is incorrect.');

        exist.password = options.newPassword;
      }
    }

    return await this.userRepo.save(exist);
  }

  async softDelete(params: UserIdDTO) {
    return await this.userRepo.softDelete(params.userId);
  }
  async hardDelete(params: UserIdDTO) {
    return await this.userRepo.delete(params.userId);
  }
}
