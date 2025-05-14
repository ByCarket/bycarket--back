import {
  Controller,
  Get,
  HttpCode,
  Param,
  Body,
  Query,
  Delete,
  UseGuards,
  ParseUUIDPipe,
  Request,
  Patch,
} from '@nestjs/common';
import { ApiBearerAuth } from '@nestjs/swagger';
import { AuthGuard } from 'src/guards/auth.guard';
import { Roles } from 'src/decorators/roles.decorator';
import { Role } from 'src/enums/roles.enum';
import { RolesGuard } from 'src/guards/roles.guard';
import { UsersService } from './users.service';
import { User } from '../../entities/user.entity';
import { PaginationDto } from 'src/dto/pagination.dto';
import { ModifyUserDto } from 'src/dto/modify-user.dto';
import { ResponseIdDto, ResponsePagUsersDto, ResponseUserDto } from 'src/dto/responses-user.dto';

@ApiBearerAuth()
@Controller('users')
@UseGuards(AuthGuard, RolesGuard)
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Get()
  @HttpCode(200)
  @Roles(Role.ADMIN)
  async getUsers(@Query() paginationDto: PaginationDto): Promise<ResponsePagUsersDto> {
    return await this.usersService.getUsers(paginationDto);
  }

  @Get(':id')
  @HttpCode(200)
  async getUserById(@Param('id', ParseUUIDPipe) id: string): Promise<ResponseUserDto> {
    return await this.usersService.getUserById(id);
  }

  @Patch('me')
  @HttpCode(200)
  async updateUser(@Request() { user }, @Body() newUser: ModifyUserDto): Promise<ResponseIdDto> {
    return await this.usersService.updateUser(user.sub, newUser);
  }

  @Roles(Role.ADMIN)
  @Delete(':id')
  @HttpCode(200)
  async deleteUser(@Param('id', ParseUUIDPipe) id: string): Promise<ResponseIdDto> {
    return await this.usersService.deleteUser(id);
  }
}
