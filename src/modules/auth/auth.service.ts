import { ConflictException, Injectable } from '@nestjs/common';
import { LoginDto } from './dto/request/login.dto';
import { RegisterDto } from './dto/request/register.dto';
import { UserService } from '../user/user.service';

@Injectable()
export class AuthService {
  constructor(private readonly userService: UserService) {}

  async register(dto: RegisterDto) {
    let user = await this.userService.findOne({
      where: { email: dto.email },
    });

    if (user) throw new ConflictException('Email Already Exist');

    user = await this.userService.findOne({
      where: { email: dto.phoneNumber },
    });

    if (user) throw new ConflictException('Phone number Already Exist');
  }

  login(dto: LoginDto) {
    return 'This action adds a new auth';
  }

  findAll() {
    return `This action returns all auth`;
  }

  findOne(id: number) {
    return `This action returns a #${id} auth`;
  }

  // update(id: number, updateAuthDto: UpdateAuthDto) {
  //   return `This action updates a #${id} auth`;
  // }

  // remove(id: number) {
  //   return `This action removes a #${id} auth`;
  // }
}
