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
  Patch,
} from '@nestjs/common';
import { ApiBearerAuth } from '@nestjs/swagger';
import { AuthGuard } from 'src/guards/auth.guard';
import { Roles } from 'src/decorators/roles.decorator';
import { Role } from 'src/enums/roles.enum';
import { RolesGuard } from 'src/guards/roles.guard';
import { UsersService } from './users.service';
import { PaginationDto } from 'src/dto/pagination.dto';
import { ModifyUserDto } from 'src/dto/modify-user.dto';
import {
  ResponseIdDto,
  ResponsePagUsersDto,
  ResponsePrivateUserDto,
  ResponsePublicUserDto,
} from 'src/dto/responses-user.dto';
import { UserAuthenticated } from 'src/decorators/userAuthenticated.decorator';

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

  @Get('me')
  @HttpCode(200)
  async getMe(@UserAuthenticated('sub') id: string): Promise<ResponsePrivateUserDto> {
    return await this.usersService.getMe(id);
  }

  @Get(':id')
  @HttpCode(200)
  async getUserById(@Param('id', ParseUUIDPipe) id: string): Promise<ResponsePublicUserDto> {
    return await this.usersService.getUserById(id);
  }

  @Patch('me')
  @HttpCode(200)
  async updateUser(
    @UserAuthenticated('sub') id: string,
    @Body() newUser: ModifyUserDto,
  ): Promise<ResponseIdDto> {
    return await this.usersService.updateUser(id, newUser);
  }

  @Roles(Role.ADMIN)
  @Delete(':id')
  @HttpCode(200)
  async deleteUser(@Param('id', ParseUUIDPipe) id: string): Promise<ResponseIdDto> {
    return await this.usersService.deleteUser(id);
  }
}
