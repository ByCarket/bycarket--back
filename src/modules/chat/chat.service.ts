import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { SendMessageDto } from 'src/DTOs/chatDto/sendMessage.dto';
import { Message } from 'src/entities/message.entity';
import { User } from 'src/entities/user.entity';
import { Inbox } from 'src/interfaces/inbox.interface';
import { Repository } from 'typeorm';

@Injectable()
export class ChatService {
  constructor(
    @InjectRepository(Message)
    private readonly messagesRepository: Repository<Message>,
    @InjectRepository(User)
    private readonly usersRepository: Repository<User>,
  ) {}

  getRoomId(user1: string, user2: string): string {
    return [user1, user2].sort().join('-');
  }

  async saveMessage(senderId: string, { receiverId, content }: SendMessageDto): Promise<Message> {
    const roomId = this.getRoomId(senderId, receiverId);
    const sender = await this.usersRepository.findOneBy({ id: senderId });
    const receiver = await this.usersRepository.findOneBy({ id: receiverId });
    if (!sender || !receiver) throw new Error('Sender or receiver not found');

    const message = await this.messagesRepository.create({
      sender,
      receiver,
      content,
      roomId,
    });

    return this.messagesRepository.save(message);
  }

  async getInbox(userId: string): Promise<Inbox[]> {
    const unreadCounts = await this.messagesRepository
      .createQueryBuilder('message')
      .leftJoin('message.sender', 'sender')
      .leftJoin('message.receiver', 'receiver')
      .select([
        `CASE 
         WHEN sender.id = :userId THEN receiver.id 
         ELSE sender.id 
        END AS "otherUserId"`,
        'COUNT(*)::int AS "unreadCount"',
      ])
      .where('receiver.id = :userId')
      .andWhere('message.isRead = false')
      .groupBy(`"otherUserId"`)
      .setParameter('userId', userId)
      .getRawMany();

    const unreadList = new Map<string, number>();
    for (const row of unreadCounts) {
      unreadList.set(row.otherUserId, row.unreadCount);
    }

    const lastMessages = await this.messagesRepository
      .createQueryBuilder('message')
      .leftJoinAndSelect('message.sender', 'sender')
      .leftJoinAndSelect('message.receiver', 'receiver')
      .where('sender.id = :userId OR receiver.id = :userId', { userId })
      .orderBy('message.created_at', 'DESC')
      .getMany();

    const conversations = new Map<string, Inbox>();

    for (const message of lastMessages) {
      const otherUser = message.sender.id === userId ? message.receiver : message.sender;

      if (!conversations.has(otherUser.id)) {
        conversations.set(otherUser.id, {
          userId: otherUser.id,
          lastMessage: message.content,
          created_at: message.created_at,
          unreadCount: unreadList.get(otherUser.id) || 0,
        });
      }
    }

    return Array.from(conversations.values());
  }

  async getHistory(userId: string, otherUserId: string) {
    const roomId = this.getRoomId(userId, otherUserId);

    return this.messagesRepository.find({
      where: { roomId },
      order: { created_at: 'ASC' },
    });
  }

  async markAsRead(roomId: string, userId: string) {
    const result = await this.messagesRepository.update(
      { roomId, receiver: { id: userId }, isRead: false },
      { isRead: true },
    );

    return result.affected ?? 0;
  }
}
