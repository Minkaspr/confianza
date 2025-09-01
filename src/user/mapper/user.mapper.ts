import { User } from '@prisma/client';
import { UserDetailRs } from '../response/user-detail-rs';
import { UserItemRs } from '../response/user-item-rs';
import { UsersRs } from '../response/users-rs';

export class UserMapper {
  static toUserDetail(user: User): UserDetailRs {
    return {
      id: user.id,
      firstName: user.firstName,
      lastName: user.lastName,
      email: user.email,
      role: user.role,
      status: user.status,
      createdAt: user.createdAt,
      updatedAt: user.updatedAt,
    };
  }

  static toUserItem(user: User): UserItemRs {
    return {
      id: user.id,
      firstname: user.firstName, // Nota el cambio de case
      lastname: user.lastName, // Nota el cambio de case
      role: user.role,
      status: user.status,
      createdAt: user.createdAt.toISOString(), // Convertir a string
    };
  }

  static toUsersList(
    users: User[],
    currentPage: number,
    totalPages: number,
    totalItems: number,
  ): UsersRs {
    return {
      users: users.map((user) => this.toUserItem(user)),
      currentPage,
      totalPages,
      totalItems,
    };
  }

  // Método auxiliar para mapear arrays
  static toUserDetailList(users: User[]): UserDetailRs[] {
    return users.map((user) => this.toUserDetail(user));
  }
}
