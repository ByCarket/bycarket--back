import {
  Controller,
  Get,
  HttpCode,
  Param,
  Put,
  Body,
  Query,
  Delete,
  UseGuards,
  ParseUUIDPipe,
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

@ApiBearerAuth()
@Controller('users')
@UseGuards(AuthGuard)
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Get()
  @HttpCode(200)
  @Roles(Role.ADMIN)
  @UseGuards(RolesGuard)
  getUsers(@Query() paginationDto: PaginationDto): Promise<{
    data: Omit<User, 'password'>[];
    total: number;
    page: number;
    limit: number;
    totalPages: number;
  }> {
    return this.usersService.getUsers(paginationDto);
  }

  @Get(':id')
  @HttpCode(200)
  getUserById(@Param('id', ParseUUIDPipe) id: string): Promise<ModifyUserDto> {
    return this.usersService.getUserById(id);
  }

  @Put('/update/:id')
  @HttpCode(201)
  updateUser(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() user: ModifyUserDto,
  ) {
    return this.usersService.updateUser(id, user);
  }

  @Delete(':id')
  deleteUser(@Param('id', ParseUUIDPipe) id: string) {
    return this.usersService.deleteUser(id);
  }
}
