import { Controller, Get, HttpCode, Param, Patch, Post, UseGuards } from '@nestjs/common';
import { SubscriptionService } from './subscription.service';
import { UserAuthenticated } from 'src/decorators/userAuthenticated.decorator';
import { AuthGuard } from 'src/guards/auth.guard';
import { ApiBearerAuth } from '@nestjs/swagger';
import { RolesGuard } from 'src/guards/roles.guard';
import { Role } from 'src/enums/roles.enum';
import { Roles } from 'src/decorators/roles.decorator';

@ApiBearerAuth()
@UseGuards(AuthGuard, RolesGuard)
@Controller('subscription')
export class SubscriptionController {
  constructor(private readonly subscriptionService: SubscriptionService) {}

  @Get('me')
  @HttpCode(200)
  async getSubscription(@UserAuthenticated('sub') userId: string) {
    return await this.subscriptionService.getSubscription(userId);
  }

  @Get('session/:id')
  @HttpCode(200)
  async getSessionById(@Param('id') id: string) {
    return await this.subscriptionService.getSessionById(id);
  }

  @Post(':id')
  @HttpCode(200)
  async createSession(@UserAuthenticated('sub') userId: string, @Param('id') priceId: string) {
    return await this.subscriptionService.createSession(userId, priceId);
  }

  @Roles(Role.PREMIUM)
  @Patch('cancel')
  @HttpCode(200)
  async cancelSubsription(@UserAuthenticated('sub') userId: string) {
    return await this.subscriptionService.cancelSubscription(userId);
  }
}
