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
import { PaginationDto } from 'src/dto/pagination.dto';
import { ModifyUserDto } from 'src/dto/usersDto/modify-user.dto';
import {
  ResponseIdDto,
  ResponsePagUsersDto,
  ResponsePrivateUserDto,
  ResponsePublicUserDto,
} from 'src/dto/usersDto/responses-user.dto';
import { UserAuthenticated } from 'src/decorators/userAuthenticated.decorator';
import { apiGetUsersDocs } from './decorators/apiGetUsersDocs.decorator';
import { ApiGetMyUserDocs } from './decorators/apiGetMyUserDocs.decorator';
import { ApiGetUserByIdDocs } from './decorators/apiGetUserByIdDocs.decorator';
import { ApiUpdateMyUserDocs } from './decorators/apiUpdateMyUserDocs.decorator';
import { ApiUpgradeAdminDocs } from './decorators/apiUpgradeAdminDocs.decorator';
import { ApiDeleteMyUserDocs } from './decorators/apiDeleteMyUserDocs.decoratos';
import { ApiDeleteUserDocs } from './decorators/apiDeleteUserDocs.decorator';

@ApiExtraModels(ModifyUserDto)
@ApiBearerAuth()
@Controller('users')
@UseGuards(AuthGuard, RolesGuard)
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @apiGetUsersDocs()
  @Get()
  @HttpCode(200)
  @Roles(Role.ADMIN)
  async getUsers(@Query() paginationDto: PaginationDto): Promise<ResponsePagUsersDto> {
    return await this.usersService.getUsers(paginationDto);
  }

  @ApiGetMyUserDocs()
  @Get('me')
  @HttpCode(200)
  async getMyUser(@UserAuthenticated('sub') id: string): Promise<ResponsePrivateUserDto> {
    return await this.usersService.getMyUser(id);
  }

  @ApiGetUserByIdDocs()
  @Get(':id')
  @HttpCode(200)
  async getUserById(@Param('id', ParseUUIDPipe) id: string): Promise<ResponsePublicUserDto> {
    return await this.usersService.getUserById(id);
  }

  @ApiUpdateMyUserDocs()
  @Patch('me')
  @HttpCode(200)
  async updateUser(
    @UserAuthenticated('sub') id: string,
    @Body() newUser: ModifyUserDto,
  ): Promise<ResponseIdDto> {
    return await this.usersService.updateMyUser(id, newUser);
  }

  @ApiUpgradeAdminDocs()
  @Patch(':id/role')
  @HttpCode(200)
  @Roles(Role.ADMIN)
  async upgradeToAdmin(@Param('id', ParseUUIDPipe) id: string): Promise<ResponseIdDto> {
    return await this.usersService.upgradeToAdmin(id);
  }

  @ApiDeleteMyUserDocs()
  @Delete('me')
  @HttpCode(200)
  async deleteMyUser(@UserAuthenticated('sub') id: string): Promise<ResponseIdDto> {
    return await this.usersService.deleteUser(id);
  }

  @ApiDeleteUserDocs()
  @Delete(':id')
  @HttpCode(200)
  @Roles(Role.ADMIN)
  async deleteUser(@Param('id', ParseUUIDPipe) id: string): Promise<ResponseIdDto> {
    return await this.usersService.deleteUser(id);
  }
}
