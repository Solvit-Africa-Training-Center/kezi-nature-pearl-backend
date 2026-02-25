import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { FindManyOptions, FindOneOptions, Repository } from 'typeorm';
import { User } from './entities/user.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { UpdateUserDto, UpdateUserRolesDto } from './dto/request';
import { comparehashContent, hashContent } from 'src/util';
import { UserProfile, UserProfiles } from './dto/response';
import { FileService } from '../file/file.service';
import { FileType } from 'src/common/enums/product.enum';
import { CreateUserDto } from './dto/request/create-user.dto';
import { UserPreferencesService } from '../user-preferences/user-preferences.service';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User)
    private readonly userRepo: Repository<User>,
    private readonly fileService: FileService,
    private readonly preferenceService: UserPreferencesService,
  ) {}

  async create(dto: CreateUserDto) {
    if (dto.password) dto.password = await hashContent(dto.password);

    const user = await this.userRepo.save(dto);
    this.preferenceService.create({ userId: user.id });

    return user;
  }

  async findAll(options?: FindManyOptions<User>) {
    return await this.userRepo.find({
      ...options,
    });
  }

  async findOne(options: FindOneOptions<User>) {
    const user = await this.userRepo.findOne({
      ...options,
    });
    return user;
  }

  // All

  async update(id: string, dto: UpdateUserDto, picture?: Express.Multer.File) {
    const user = await this.userRepo.findOneBy({ id });

    if (!user) {
      throw new NotFoundException('User not found');
    }
    if (picture) {
      if (user.profile) this.fileService.remove(user.profile.id);
      user.profile = await this.fileService.save(picture, FileType.IMAGE);
    }

    if (dto.currentPassword) {
      if (!comparehashContent(dto.currentPassword, user.password))
        throw new BadRequestException('Invalid current password');
    }
    if (dto.password) dto.password = await hashContent(dto.password);

    Object.assign(user, dto);

    return await this.userRepo.update(id, user);
  }

  async remove(id: string) {
    await this.userRepo.delete(id);
    return { message: 'Current User Deleted' };
  }

  async getUserProfile(options: FindOneOptions<User>) {
    const user = await this.findOne(options);
    if (!user) throw new NotFoundException('User not found');
    return new UserProfile(user);
  }

  // Admin

  async getAllUsers(options?: FindManyOptions<User>) {
    const users = await this.userRepo.find(options);

    return users.map((user) => new UserProfiles(user));
  }

  async updateUserRole(dto: UpdateUserRolesDto) {
    dto.users.map(async (user) => {
      if (!(await this.findOne({ where: { id: user.id } }))) return;

      await this.update(user.id, { role: user.role });
    });
    return { message: 'Users Updated' };
  }
}
