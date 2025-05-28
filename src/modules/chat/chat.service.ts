import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Message } from 'src/entities/message.entity';
import { OrderDirectionEnum } from 'src/enums/order.enum';
import { Repository } from 'typeorm';

@Injectable()
export class ChatService {
  constructor(
    @InjectRepository(Message)
    private readonly messagesRepository: Repository<Message>,
  ) {}

  async getHistory(currentUser, otherUser) {
    return await this.messagesRepository.find({
      where: [
        { sender: { id: currentUser }, receiver: { id: otherUser } },
        { sender: { id: otherUser }, receiver: { id: currentUser } },
      ],
      order: { createdAt: OrderDirectionEnum.ASC },
    });
  }
}
