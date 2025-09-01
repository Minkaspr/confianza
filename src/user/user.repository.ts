import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma.service';
import { User, Prisma, UserRole, UserStatus } from '@prisma/client';

@Injectable()
export class UserRepository {
  constructor(private prisma: PrismaService) {}

  async findAll(): Promise<User[]> {
    return this.prisma.client.user.findMany({
      orderBy: {
        createdAt: 'desc',
      },
    });
  }

  async getMany(params: { skip?: number; take?: number }): Promise<User[]> {
    return this.prisma.client.user.findMany({
      skip: params.skip,
      take: params.take,
      orderBy: { createdAt: 'desc' },
    });
  }

  async findById(id: number): Promise<User | null> {
    return this.prisma.client.user.findUnique({
      where: { id },
    });
  }

  async findByEmail(email: string): Promise<User | null> {
    return this.prisma.client.user.findUnique({
      where: { email },
    });
  }

  async existsByEmail(email: string): Promise<boolean> {
    const count = await this.prisma.client.user.count({
      where: { email },
    });
    return count > 0;
  }

  async create(userData: Prisma.UserCreateInput): Promise<User> {
    return this.prisma.client.user.create({
      data: userData,
    });
  }

  async update(id: number, userData: Prisma.UserUpdateInput): Promise<User> {
    return await this.prisma.client.user.update({
      where: { id },
      data: userData,
    });
  }

  async delete(id: number): Promise<User> {
    return this.prisma.client.user.delete({
      where: { id },
    });
  }

  async findByRole(role: UserRole): Promise<User[]> {
    return this.prisma.client.user.findMany({
      where: { role },
      orderBy: {
        createdAt: 'desc',
      },
    });
  }

  async findByStatus(status: UserStatus): Promise<User[]> {
    return this.prisma.client.user.findMany({
      where: { status },
      orderBy: {
        createdAt: 'desc',
      },
    });
  }

  async countAll(): Promise<number> {
    return this.prisma.client.user.count();
  }

  async countByRole(role: UserRole): Promise<number> {
    return this.prisma.client.user.count({
      where: { role },
    });
  }

  async countByStatus(status: UserStatus): Promise<number> {
    return this.prisma.client.user.count({
      where: { status },
    });
  }
}
