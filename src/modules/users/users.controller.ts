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
import { ApiBearerAuth, ApiExtraModels } from '@nestjs/swagger';
import { AuthGuard } from 'src/guards/auth.guard';
import { Roles } from 'src/decorators/roles.decorator';
import { Role } from 'src/enums/roles.enum';
import { RolesGuard } from 'src/guards/roles.guard';
import { UsersService } from './users.service';
import { UpdateUserInfoDto } from 'src/DTOs/usersDto/updateUserInfo.dto';
import { UserAuthenticated } from 'src/decorators/userAuthenticated.decorator';
import { ResponsePagUsersDto } from 'src/DTOs/usersDto/responses-user.dto';
import { QueryPagUsersDto } from 'src/DTOs/usersDto/queryPagUsers.dto';
import { apiGetUsersDocs } from './decorators/apiGetUsersDocs.decorator';
import { ApiGetMyUserDocs } from './decorators/apiGetMyUserDocs.decorator';
import { ApiGetUserByIdDocs } from './decorators/apiGetUserByIdDocs.decorator';
import { ApiUpdateMyUserDocs } from './decorators/apiUpdateMyUserDocs.decorator';
import { ApiUpgradeAdminDocs } from './decorators/apiUpgradeAdminDocs.decorator';
import { ApiDeleteMyUserDocs } from './decorators/apiDeleteMyUserDocs.decorator';
import { ApiDeleteUserDocs } from './decorators/apiDeleteUserDocs.decorator';

@ApiExtraModels(UpdateUserInfoDto)
@ApiBearerAuth()
@Controller('users')
@UseGuards(AuthGuard, RolesGuard)
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @apiGetUsersDocs()
  @Get()
  @HttpCode(200)
  @Roles(Role.ADMIN)
  async getUsers(@Query() paginationDto: QueryPagUsersDto): Promise<ResponsePagUsersDto> {
    return await this.usersService.getUsers(paginationDto);
  }

  @ApiGetMyUserDocs()
  @Get('me')
  @HttpCode(200)
  async getMyUser(@UserAuthenticated('sub') id: string) {
    return await this.usersService.getMyUser(id);
  }

  @ApiGetUserByIdDocs()
  @Get(':id')
  @HttpCode(200)
  async getUserById(@Param('id', ParseUUIDPipe) id: string) {
    return await this.usersService.getUserById(id);
  }

  @ApiUpdateMyUserDocs()
  @Patch('me')
  @HttpCode(200)
  async updateUser(@UserAuthenticated('sub') id: string, @Body() newUser: UpdateUserInfoDto) {
    return await this.usersService.updateMyUser(id, newUser);
  }

  @ApiUpgradeAdminDocs()
  @Patch(':id/role')
  @HttpCode(200)
  @Roles(Role.ADMIN)
  async upgradeToAdmin(@Param('id', ParseUUIDPipe) id: string) {
    return await this.usersService.upgradeToAdmin(id);
  }

  @ApiDeleteMyUserDocs()
  @Delete('me')
  @HttpCode(200)
  async deleteMyUser(@UserAuthenticated('sub') id: string) {
    return await this.usersService.deleteUser(id);
  }

  @ApiDeleteUserDocs()
  @Delete(':id')
  @HttpCode(200)
  @Roles(Role.ADMIN)
  async deleteUser(@Param('id', ParseUUIDPipe) id: string) {
    return await this.usersService.deleteUser(id);
  }
}
