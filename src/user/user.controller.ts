import {
  Controller,
  Get,
  Post,
  Put,
  Patch,
  Delete,
  Body,
  Param,
  ParseIntPipe,
  HttpStatus,
  HttpCode,
  DefaultValuePipe,
  Query,
} from '@nestjs/common';
import { UserService } from './user.service';
import { CreateUserRq } from './request/user-create-rq';
import { UpdateUserRq } from './request/user-update-rq';
import { ChangeUserStatusRq } from './request/change-status-rq';
import { ApiResponse } from 'src/common/interfaces/api-response.interface';
import { UsersRs } from './response/users-rs';
import { UserDetailRs } from './response/user-detail-rs';

@Controller('/users')
export class UserController {
  constructor(private userService: UserService) {}

  @Get()
  @HttpCode(HttpStatus.OK)
  async getAllUsers(
    @Query('page', new DefaultValuePipe(1), ParseIntPipe) page: number,
    @Query('limit', new DefaultValuePipe(10), ParseIntPipe) limit: number,
  ): Promise<ApiResponse<UsersRs>> {
    // Validar que los valores sean positivos
    if (page < 1) page = 1;
    if (limit < 1) limit = 10;
    if (limit > 100) limit = 100; // Limitar para evitar sobrecarga

    const users = await this.userService.getAllUsers(page, limit);
    return {
      status: 'success',
      message: 'Usuarios obtenidos exitosamente',
      data: users,
    };
  }

  @Get(':id')
  @HttpCode(HttpStatus.OK)
  async getUserById(
    @Param('id', ParseIntPipe) id: number,
  ): Promise<ApiResponse<UserDetailRs>> {
    const user = await this.userService.getUserById(id);
    return {
      status: 'success',
      message: 'Usuario obtenido exitosamente',
      data: user,
    };
  }

  @Post()
  @HttpCode(HttpStatus.CREATED)
  async createUser(
    @Body() createUserDto: CreateUserRq,
  ): Promise<ApiResponse<UserDetailRs>> {
    const user = await this.userService.createUser(createUserDto);
    return {
      status: 'success',
      message: 'Usuario creado exitosamente',
      data: user,
    };
  }

  @Put(':id')
  @HttpCode(HttpStatus.OK)
  async updateUser(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateUserDto: UpdateUserRq,
  ): Promise<ApiResponse<UserDetailRs>> {
    const user = await this.userService.updateUser(id, updateUserDto);
    return {
      status: 'success',
      message: 'Usuario actualizado exitosamente',
      data: user,
    };
  }

  @Patch(':id/status')
  @HttpCode(HttpStatus.OK)
  async changeUserStatus(
    @Param('id', ParseIntPipe) id: number,
    @Body() changeStatusDto: ChangeUserStatusRq,
  ): Promise<ApiResponse<UserDetailRs>> {
    const user = await this.userService.changeUserStatus(
      id,
      changeStatusDto.status,
    );
    return {
      status: 'success',
      message: 'Estado del usuario actualizado exitosamente',
      data: user,
    };
  }

  @Delete(':id')
  @HttpCode(HttpStatus.OK)
  async deleteUser(
    @Param('id', ParseIntPipe) id: number,
  ): Promise<ApiResponse<{ message: string }>> {
    const result = await this.userService.deleteUser(id);
    return {
      status: 'success',
      message: 'Usuario eliminado exitosamente',
      data: result,
    };
  }
}
