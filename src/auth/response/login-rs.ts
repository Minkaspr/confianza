import { UserRole, UserStatus } from '@prisma/client';

export class LoginRs {
  user: {
    id: number;
    firstName: string;
    lastName: string;
    email: string;
    role: UserRole;
    status: UserStatus;
  };
  accessToken: string;
  refreshToken: string;
}
