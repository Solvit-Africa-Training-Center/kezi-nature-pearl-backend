import { userStatusEnum } from '@/common/enums/userStatus.enum';
import { User } from '../user.entity';

// me
export class UserProfileResponseDto {
  id: string;
  profile: string | null;
  fullName: string;
  email: string;
  role: string;
  phoneNumber: string;
  status: userStatusEnum;
  emailVerifiedAt: Date;
  createdAt: Date;

  constructor(user: User) {
    this.id = user.userId;
    this.profile = user.file.url;
    this.fullName = user.fullName;
    this.email = user.email;
    this.role = user.role;
    this.phoneNumber = user.phoneNumber;
    this.status = user.status;
    this.emailVerifiedAt = user.emailVerifiedAt;
    this.createdAt = user.createdAt;
  }
}
