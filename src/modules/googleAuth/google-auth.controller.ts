import { Controller, Post, Req, Body } from '@nestjs/common';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { GoogleAuthService } from './google-auth.service';
import { CompleteProfileDto } from '../../dto/complete-profile.dto';

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
    const user = await this.googleAuthService.processGoogleUser(googleProfile);
    return {
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
        role: user.role,
        profileComplete: user.profileComplete,
      },
      message: 'User processed successfully',
    };
  }

  @Post('complete-profile')
  @ApiOperation({ summary: 'Complete profile of user' })
  @ApiResponse({
    status: 200,
    description: 'User profile completed successfully',
  })
  async completeProfile(@Body() profileData: CompleteProfileDto & { email: string }) {
    const user = await this.googleAuthService.findUserByEmail(profileData.email);

    if (!user) {
        throw new Error('User not found');
    }

    const updatedUser = await this.googleAuthService.completeUserProfile(user.id, profileData);

    return {
      user: {
        id: updatedUser.id,
        email: updatedUser.email,
        name: updatedUser.name,
        role: updatedUser.role,
        profileComplete: updatedUser.profileComplete,
      },
      message: 'User profile completed successfully',
    };
  }
}
