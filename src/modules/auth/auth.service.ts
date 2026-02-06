import {
  ConflictException,
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { LoginDto } from './dto/request/login.dto';
import { RegisterDto } from './dto/request/register.dto';
import { UserService } from '../user/user.service';

@Injectable()
export class AuthService {
  constructor(private readonly userService: UserService) {}

  async register(dto: RegisterDto) {
    const existingUserByEmail = await this.userService.findOne({
      where: { email: dto.email.toLowerCase().trim() },
    });

    if (existingUserByEmail) {
      throw new ConflictException('Email already exists');
    }

    const existingUserByPhone = await this.userService.findOne({
      where: { phoneNumber: dto.phoneNumber },
    });

    if (existingUserByPhone) {
      throw new ConflictException('Phone number already exists');
    }

    // let user = await this.userService.findOne({
    //   where: { email: dto.email },
    // });

    // if (user) throw new ConflictException('Email Already Exist');

    // user = await this.userService.findOne({
    //   where: { email: dto.phoneNumber },
    // });

    // if (user) throw new ConflictException('Phone number Already Exist');

    // await this.userService.create(dto);

    // return { message: 'User Registered' };
  }

  async login(dto: LoginDto) {
    const user = await this.userService.findOne({
      where: { email: dto.email },
    });

    if (!user || (await user.validatePassword(dto.password)))
      throw new NotFoundException('Invalid Credentials');

    if (user.verifiedAt == null)
      throw new ForbiddenException('Account not verified');

    return { message: 'Login Successful' };
  }
}
