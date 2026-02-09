import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { FindOneOptions, Repository } from 'typeorm';
import { User } from './entities/user.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { RegisterDto } from '../auth/dto/request';
import { UpdateUserDto } from './dto/request';
import { comparehashContent, hashContent } from 'src/util';
import { UserProfile } from './dto/response';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User)
    private readonly userRepo: Repository<User>,
  ) {}

  async create(dto: RegisterDto) {
    if (dto.password) dto.password = await hashContent(dto.password);

    return await this.userRepo.save(dto);
  }

  findAll() {
    return `This action returns all user`;
  }

  async findOne(options: FindOneOptions<User>) {
    const user = await this.userRepo.findOne({ ...options });
    return user;
  }

  async update(id: string, dto: UpdateUserDto) {
    const user = await this.userRepo.findOneBy({ id });

    if (!user) {
      throw new NotFoundException('User not found');
    }

    if (dto.currentPassword) {
      if (!comparehashContent(dto.currentPassword, user.password))
        throw new BadRequestException('Invalid current password');
    }
    if (dto.password) dto.password = await hashContent(dto.password);

    Object.assign(user, dto);

    return await this.userRepo.save(user);
  }

  remove(id: number) {
    return `This action removes a #${id} user`;
  }

  async getUserProfile(options: FindOneOptions<User>) {
    const user = await this.findOne(options);
    if (!user) throw new NotFoundException('User not found');
    return new UserProfile(user);
  }
}
