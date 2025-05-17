import { Controller, Post, Body, HttpCode, UseGuards, Patch } from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { CreateUserDto } from 'src/dto/create-user.dto';
import { LoginUserDto } from 'src/dto/login-user.dto';
import { AuthService } from './auth.service';
import { UserAuthenticated } from 'src/decorators/userAuthenticated.decorator';
import { ChangeEmailDto } from 'src/dto/change-email.dto';
import { ResponseIdDto } from 'src/dto/responses-user.dto';
import { AuthGuard } from 'src/guards/auth.guard';
import { ChangePasswordDto } from 'src/dto/change-password.dto';

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

  @ApiBearerAuth()
  @UseGuards(AuthGuard)
  @Patch('change-email')
  @HttpCode(200)
  async changeEmail(
    @UserAuthenticated('sub') id: string,
    @Body() { email }: ChangeEmailDto,
  ): Promise<ResponseIdDto> {
    return await this.authService.changeEmail(id, email);
  }

  @ApiBearerAuth()
  @UseGuards(AuthGuard)
  @Patch('change-password')
  @HttpCode(200)
  async changePassword(
    @UserAuthenticated('sub') id: string,
    @Body() changePasswordDto: ChangePasswordDto,
  ): Promise<ResponseIdDto> {
    return await this.authService.changePassword(id, changePasswordDto);
  }
}
