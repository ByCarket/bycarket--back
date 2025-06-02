import {
  ConnectedSocket,
  MessageBody,
  OnGatewayConnection,
  OnGatewayInit,
  SubscribeMessage,
  WebSocketGateway,
} from '@nestjs/websockets';
import { ChatService } from './chat.service';
import { Server, Socket } from 'socket.io';
import { SendMessageDto } from 'src/DTOs/chatDto/sendMessage.dto';
import { UseGuards } from '@nestjs/common';
import { WsAuthGuard } from 'src/guards/ws-auth.guard';
import { WsUserAuth } from 'src/decorators/wsUserAuth.decorator';

@UseGuards(WsAuthGuard)
@WebSocketGateway({
  cors: { origin: '*' },
})
export class ChatGateway implements OnGatewayInit, OnGatewayConnection {
  constructor(private readonly chatService: ChatService) {}

  server: Server;

  afterInit(server: Server) {
    this.server = server;
  }

  handleConnection(socket: Socket) {
    const userId = socket.data.user?.sub;
    if (!userId) {
      socket.disconnect();
      return;
    }
    console.log(`User ${userId} connected.`);
  }

  @SubscribeMessage('join_inbox')
  handleJoinInbox(@WsUserAuth('sub') userId: string, @ConnectedSocket() socket: Socket) {
    socket.join(`inbox_${userId}`);
  }

  @SubscribeMessage('leave_inbox')
  handleLeaveInbox(@WsUserAuth('sub') userId: string, @ConnectedSocket() socket: Socket) {
    socket.leave(`inbox_${userId}`);
  }

  @SubscribeMessage('join_room')
  async handleJoinRoom(
    @WsUserAuth('sub') userId: string,
    @MessageBody() otherUserId: string,
    @ConnectedSocket() socket: Socket,
  ) {
    const roomId = this.chatService.getRoomId(userId, otherUserId);
    socket.join(roomId);

    await this.chatService.markAsRead(roomId, userId);
  }

  @SubscribeMessage('leave_room')
  handleLeaveRoom(
    @WsUserAuth('sub') userId: string,
    @MessageBody() otherUserId: string,
    @ConnectedSocket() socket: Socket,
  ) {
    const roomId = this.chatService.getRoomId(userId, otherUserId);
    socket.leave(roomId);
  }

  @SubscribeMessage('send_message')
  async handleSendMessage(
    @WsUserAuth('sub') senderId: string,
    @MessageBody() { receiverId, content }: SendMessageDto,
    @ConnectedSocket() socket: Socket,
  ) {
    try {
      const message = await this.chatService.saveMessage(senderId, { receiverId, content });
      const roomId = this.chatService.getRoomId(senderId, receiverId);

      const sockets = await this.server.in(roomId).fetchSockets();
      const isReceiverInRoom = sockets.some(socket => socket.data.user.sub === receiverId);
      if (isReceiverInRoom) {
        await this.chatService.markAsRead(roomId, receiverId);
        message.isRead = true;
      }

      this.server.to(roomId).emit('receive_message', message);

      const receiverInbox = await this.chatService.getInbox(receiverId);
      const senderInbox = await this.chatService.getInbox(senderId);

      this.server.to(`inbox_${receiverId}`).emit('inbox_update', receiverInbox);
      this.server.to(`inbox_${senderId}`).emit('inbox_update', senderInbox);
    } catch (error) {
      console.error('Error sending message:', error.response?.message || error.message);
      socket.emit('error_message', {
        error: error.response?.message || error.message,
      });
    }
  }
}
