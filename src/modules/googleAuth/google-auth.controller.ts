import { Controller, Post, Req, Body } from '@nestjs/common';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { GoogleAuthService } from './google-auth.service';

@ApiTags('google-auth')
@Controller('google-auth')
export class GoogleAuthController {
  constructor(private readonly googleAuthService: GoogleAuthService) {}

  @Post('process-login')
  @ApiOperation({ summary: 'Process Google user data after login with NextAuth' })
  @ApiResponse({
    status: 200,
    description: 'User processed successfully',
  })
  async processGoogleLogin(@Body() googleProfile: any) {
    const { user, token } = await this.googleAuthService.processGoogleUser(googleProfile);
    return {
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
        role: user.role,
      },
      token,
      message: 'User processed successfully',
    };
  }
}
