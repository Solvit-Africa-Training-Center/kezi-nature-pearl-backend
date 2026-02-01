import { User } from '../user.entity';

// me
export class UserProfileResponseDto {
  profile: string | null;
  fullName: string;
  email: string;
  role: string;
  phoneNumber: string;
  createdAt: Date;

  constructor(user: User) {
    this.profile = user.file?.url ? user.file.url : null;
    this.fullName = user.fullName;
    this.email = user.email;
    this.role = user.role;
    this.phoneNumber = user.phoneNumber;
    this.createdAt = user.createdAt;
  }
}
