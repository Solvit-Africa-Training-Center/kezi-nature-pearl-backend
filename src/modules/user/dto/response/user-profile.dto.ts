import { UserRole } from 'src/common/enums/user.enum';
import { User } from '../../entities/user.entity';

export class UserProfile {
  id: string;
  profile: string | null;
  fullName: string | null;
  email: string;
  phoneNumber: string;
  role: UserRole;
  createdAt: Date;

  constructor(user: User) {
    this.id = user.id;
    this.profile = user.profile?.url ?? null;
    this.fullName = user.fullName ?? null;
    this.email = user.email;
    this.phoneNumber = user.phoneNumber;
    this.role = user.role;
    this.createdAt = user.createdAt;
  }
}
