import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { FindOneOptions, Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from './user.entity';
import { FileService } from '../file/file.service';
import { CreateAdminDTO, UserIdDTO } from './dto/user-request.dto';
import { comparehashContent, hashContent } from '@/util/lib';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User)
    private readonly userRepo: Repository<User>,
    private readonly fileSerive: FileService,
  ) {}

  async create(user: CreateAdminDTO) {
    return await this.userRepo.save(user);
  }

  async find(options?: FindOneOptions<User>) {
    return await this.userRepo.find({ ...options });
  }

  async findOne(options: FindOneOptions<User>) {
    const user = await this.userRepo.findOne({
      ...options,
    });

    return user;
  }

  async update(
    user: Partial<User>,
    options?: {
      profilePicture?: Express.Multer.File;
      fileType?: string;
      currentPassword?: string;
      newPassword?: string;
    },
  ) {
    const exist = await this.findOne({ where: { userId: user.userId } });
    if (!exist) throw new NotFoundException('User not found.');

    exist.email = user.email ?? exist.email;
    exist.profile = user.profile ?? exist.profile;
    exist.fullName = user.fullName ?? exist.fullName;
    exist.phoneNumber = user.phoneNumber ?? exist.phoneNumber;
    exist.password = user.password ?? exist.password;
    exist.role = user.role ?? exist.role;
    exist.emailVerifiedAt = user.emailVerifiedAt ?? exist.emailVerifiedAt;

    if (options) {
      if (options.currentPassword && options.newPassword) {
        if (!comparehashContent(exist.password, options.currentPassword))
          throw new BadRequestException('Current password is incorrect.');

        exist.password = hashContent(options.newPassword);
      }

      if (options.profilePicture && options.fileType) {
        const newFile = await this.fileSerive.save(
          options.profilePicture,
          options.fileType,
        );
        exist.profile = newFile.fileId;
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
