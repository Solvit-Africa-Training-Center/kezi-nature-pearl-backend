import { UserRole, UserStatus } from 'src/common/enums/user.enum';
import { User } from '../../entities/user.entity';

export class UserProfile {
  id: string;
  profile: string | null;
  fullName: string | null;
  email: string;
  phoneNumber: string;
  role: UserRole;
  preferences: object;
  createdAt: Date;

  constructor(user: User) {
    this.id = user.id;
    this.profile = user.profile?.url ?? null;
    this.fullName = user.fullName ?? null;
    this.email = user.email;
    this.phoneNumber = user.phoneNumber;
    this.role = user.role;
    this.preferences = {
      currency: {
        id: user.preferences.currency.id,
        code: user.preferences.currency.code,
      },
    };
    this.createdAt = user.createdAt;
  }
}

export class UserProfiles {
  id: string;
  profile: string | null;
  fullName: string | null;
  email: string;
  phoneNumber: string;
  role: UserRole;
  status: UserStatus;
  verifiedAt: Date | undefined;
  createdAt: Date;
  lastLoginAt: Date | undefined;

  constructor(user: User) {
    this.id = user.id;
    this.profile = user.profile?.url ?? null;
    this.fullName = user.fullName ?? null;
    this.email = user.email;
    this.phoneNumber = user.phoneNumber;
    this.role = user.role;
    this.status = user.status;
    this.verifiedAt = user.verifiedAt ?? undefined;
    this.createdAt = user.createdAt;
    this.lastLoginAt = user.lastLoginAt ?? undefined;
  }
}
