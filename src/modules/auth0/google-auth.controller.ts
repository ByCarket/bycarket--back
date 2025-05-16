import { Controller, Post, Req, Body } from '@nestjs/common';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { GoogleAuthService } from './google-auth.service';
import { CompleteProfileDto } from '../../dto/complete-profile.dto';

@ApiTags('google-auth')
@Controller('google-auth')
export class GoogleAuthController {
  constructor(private readonly googleAuthService: GoogleAuthService) {}

  @Post('process-login')
  @ApiOperation({ summary: 'Procesar datos de usuario de Google después del login con NextAuth' })
  @ApiResponse({
    status: 200,
    description: 'Usuario de Google procesado correctamente',
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
      message: 'Usuario de Google procesado correctamente',
    };
  }

  @Post('complete-profile')
  @ApiOperation({ summary: 'Completa el perfil del usuario de Google' })
  @ApiResponse({
    status: 200,
    description: 'Perfil del usuario completado correctamente',
  })
  async completeProfile(@Body() profileData: CompleteProfileDto & { email: string }) {
    const user = await this.googleAuthService.findUserByEmail(profileData.email);

    if (!user) {
        throw new Error('El user no se encontró en la base de datos');
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
      message: 'Perfil completado correctamente',
    };
  }
}
