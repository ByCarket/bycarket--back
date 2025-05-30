import { CreateUserDto } from 'src/DTOs/usersDto/createUser.dto';
import { LoginUserDto } from 'src/DTOs/usersDto/loginUser.dto';
import { Controller, Post, Body, HttpCode, UseGuards, Patch, Get, Param } from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { AuthService } from './auth.service';
import { UserAuthenticated } from 'src/decorators/userAuthenticated.decorator';
import { ChangeEmailDto } from 'src/DTOs/usersDto/changeEmail.dto';
import { AuthGuard } from 'src/guards/auth.guard';
import { ChangePasswordDto } from 'src/DTOs/usersDto/changePassword.dto';
import { GoogleProfileDto } from 'src/DTOs/usersDto/google-profile.dto';

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
    return await this.authService.register(createUserDto);
  }

  @Get('activate/:token')
  async activateAccount(@Param('token') token: string) {
    return this.authService.activateAccount(token);
  }

  @Post('resend-activation')
  async resendActivationEmail(@Body('email') email: string) {
    return this.authService.resendActivationEmail(email);
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

  @Post('process-google')
  @HttpCode(200)
  @ApiOperation({ summary: 'Process Google user data after login with NextAuth' })
  @ApiResponse({
    status: 200,
    description: 'User processed successfully',
  })
  async processGoogleLogin(@Body() googleProfile: GoogleProfileDto) {
    return await this.authService.processGoogleUser(googleProfile);
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
  async changeEmail(@UserAuthenticated('sub') id: string, @Body() { email }: ChangeEmailDto) {
    return await this.authService.changeEmail(id, email);
  }

  @ApiBearerAuth()
  @UseGuards(AuthGuard)
  @Patch('change-password')
  @HttpCode(200)
  async changePassword(
    @UserAuthenticated('sub') id: string,
    @Body() changePasswordDto: ChangePasswordDto,
  ) {
    return await this.authService.changePassword(id, changePasswordDto);
  }
}
