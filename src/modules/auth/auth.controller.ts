import { Controller, Post, Body, HttpCode } from '@nestjs/common';
import { ApiOperation, ApiResponse } from '@nestjs/swagger';
import { CreateUserDto } from 'src/dto/create-user.dto';
import { LoginUserDto } from 'src/dto/login-user.dto';
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
    summary:
      'User Creation (email, password, name, phone, country, city, address)',
  })
  async register(@Body() createUserDto: CreateUserDto) {
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { confirmPassword, ...userWithoutConfirmPassword } = createUserDto;
    return await this.authService.signup(userWithoutConfirmPassword);
  }

  @Post('login')
  @ApiOperation({ summary: 'User Login (email and  password)' })
  login(@Body() loginUserDto: LoginUserDto) {
    return this.authService.signin(loginUserDto);
  }
}
