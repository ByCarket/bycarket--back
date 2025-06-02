import { Controller, Get, Param, Patch, UseGuards } from '@nestjs/common';
import { ChatService } from './chat.service';
import { UserAuthenticated } from 'src/decorators/userAuthenticated.decorator';
import { AuthGuard } from 'src/guards/auth.guard';

@UseGuards(AuthGuard)
@Controller('chat')
export class ChatController {
  constructor(private readonly chatService: ChatService) {}

  @Get('inbox')
  async getInbox(@UserAuthenticated('sub') userId: string) {
    return await this.chatService.getInbox(userId);
  }

  @Get('history/:id')
  async getHistory(@UserAuthenticated('sub') userId: string, @Param('id') otherUserId: string) {
    return await this.chatService.getHistory(userId, otherUserId);
  }
}
