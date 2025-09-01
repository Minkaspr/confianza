import { Injectable } from '@nestjs/common';
import {
  DuplicateResourceException,
  ResourceNotFoundException,
} from '../common/exceptions/base.exception';
import { CreateUserRq } from './request/user-create-rq';
import { UpdateUserRq } from './request/user-update-rq';
import * as bcrypt from 'bcrypt';
import { UserStatus } from '@prisma/client';
import { UserMapper } from './mapper/user.mapper';
import { UsersRs } from './response/users-rs';
import { UserRepository } from './user.repository';
import { UserDetailRs } from './response/user-detail-rs';

@Injectable()
export class UserService {
  constructor(private userRepository: UserRepository) {}

  async getAllUsers(page: number = 1, limit: number = 10): Promise<UsersRs> {
    const skip = (page - 1) * limit;

    const [users, totalItems] = await Promise.all([
      this.userRepository.getMany({ skip, take: limit }),
      this.userRepository.countAll(),
    ]);

    const totalPages = Math.ceil(totalItems / limit);

    return UserMapper.toUsersList(users, page, totalPages, totalItems);
  }

  async getUserById(id: number): Promise<UserDetailRs> {
    const user = await this.userRepository.findById(id);

    if (!user) {
      throw new ResourceNotFoundException(`Usuario con ID ${id} no encontrado`);
    }

    return UserMapper.toUserDetail(user);
  }

  async createUser(createUserDto: CreateUserRq): Promise<UserDetailRs> {
    // Verificar si el email ya existe
    const emailExists = await this.userRepository.existsByEmail(
      createUserDto.email,
    );

    if (emailExists) {
      throw new DuplicateResourceException(
        'Ya existe un usuario con este email',
      );
    }

    // Hashear la contraseña
    const saltRounds = 12;
    const hashedPassword = await bcrypt.hash(
      createUserDto.password,
      saltRounds,
    );

    const user = await this.userRepository.create({
      ...createUserDto,
      password: hashedPassword,
    });

    return UserMapper.toUserDetail(user);
  }

  async updateUser(
    id: number,
    updateUserDto: UpdateUserRq,
  ): Promise<UserDetailRs> {
    // Validar que el usuario exista
    const user = await this.userRepository.findById(id);
    if (!user) {
      throw new ResourceNotFoundException(`Usuario con ID ${id} no encontrado`);
    }

    // Validar email único (si se quiere cambiar el email)
    if (updateUserDto.email) {
      const existingUser = await this.userRepository.findByEmail(
        updateUserDto.email,
      );
      if (existingUser && existingUser.id !== id) {
        throw new DuplicateResourceException(
          'Ya existe un usuario con este email',
        );
      }
    }

    // Remover contraseña del DTO
    const dataToUpdate = { ...updateUserDto };
    delete dataToUpdate.password;

    // Dejar que Prisma maneje el update, los errores se propagan al filtro global
    const updatedUser = await this.userRepository.update(id, dataToUpdate);
    return UserMapper.toUserDetail(updatedUser);
  }

  async updatePassword(id: number, newPassword: string): Promise<UserDetailRs> {
    // Validar que el usuario exista
    const user = await this.userRepository.findById(id);
    if (!user) {
      throw new ResourceNotFoundException(`Usuario con ID ${id} no encontrado`);
    }

    // Hashear la nueva contraseña
    const saltRounds = 12;
    const hashedPassword = await bcrypt.hash(newPassword, saltRounds);

    // Update directo sin try/catch
    const updatedUser = await this.userRepository.update(id, {
      password: hashedPassword,
    });
    return UserMapper.toUserDetail(updatedUser);
  }

  async deleteUser(id: number): Promise<{ message: string }> {
    const user = await this.userRepository.findById(id);

    if (!user) {
      throw new ResourceNotFoundException(`Usuario con ID ${id} no encontrado`);
    }
    await this.userRepository.delete(id);
    return { message: `Usuario con ID ${id} eliminado exitosamente` };
  }

  async changeUserStatus(
    id: number,
    status: UserStatus,
  ): Promise<UserDetailRs> {
    const existingUser = await this.userRepository.findById(id);

    if (!existingUser) {
      throw new ResourceNotFoundException(`Usuario con ID ${id} no encontrado`);
    }

    const updatedUser = await this.userRepository.update(id, { status });
    return UserMapper.toUserDetail(updatedUser);
  }

  async findByEmail(email: string) {
    return this.userRepository.findByEmail(email);
  }

  async findById(id: number) {
    return this.userRepository.findById(id);
  }
}
