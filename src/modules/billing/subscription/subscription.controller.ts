import { Controller, Get, HttpCode, Param, Post, UseGuards } from '@nestjs/common';
import { SubscriptionService } from './subscription.service';
import { UserAuthenticated } from 'src/decorators/userAuthenticated.decorator';
import { AuthGuard } from 'src/guards/auth.guard';
import { ApiBearerAuth } from '@nestjs/swagger';

@ApiBearerAuth()
@UseGuards(AuthGuard)
@Controller('subscription')
export class SubscriptionController {
  constructor(private readonly subscriptionService: SubscriptionService) {}

  @Get(':id')
  @HttpCode(200)
  async getSessionById(@Param('id') id: string) {
    return await this.subscriptionService.getSessionById(id);
  }

  @Post(':id')
  @HttpCode(200)
  async createSubMembership(
    @UserAuthenticated('sub') userId: string,
    @Param('id') priceId: string,
  ) {
    return await this.subscriptionService.createSubMembership(userId, priceId);
  }
}
