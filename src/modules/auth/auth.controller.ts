import { Controller, Post, Body, HttpCode } from '@nestjs/common';
import { ApiOperation, ApiResponse } from '@nestjs/swagger';
import { CreateUserDto } from 'src/dto/usersDto/create-user.dto';
import { LoginUserDto } from 'src/dto/usersDto/login-user.dto';
import { AuthService } from './auth.service';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('register')
  @HttpCode(201)
  @ApiResponse({
    status: 201,
    description: 'User created successfully',
  })
  @ApiOperation({
    summary: 'User Creation (email, password, name, phone, country, city, address)',
  })
  async register(@Body() createUserDto: CreateUserDto) {
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { confirmPassword, ...userWithoutConfirmPassword } = createUserDto;
    return await this.authService.register(userWithoutConfirmPassword);
  }

  @Post('login')
  @HttpCode(200)
  @ApiResponse({
    status: 200,
    description: 'User logged in successfully',
  })
  @ApiOperation({ summary: 'User Login (email and  password)' })
  login(@Body() loginUserDto: LoginUserDto) {
    return this.authService.login(loginUserDto);
  }

  @Post('create-admin')
  @HttpCode(201)
  @ApiResponse({
    status: 201,
    description: 'Admin created successfully',
  })
  @ApiOperation({
    summary: 'Admin creation (email, password, name, phone, country, city, address)',
  })
  async createAdmin(@Body() createUserDto: CreateUserDto) {
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { confirmPassword, ...userWithoutConfirmPassword } = createUserDto;
    return await this.authService.createAdmin(userWithoutConfirmPassword);
  }
}
