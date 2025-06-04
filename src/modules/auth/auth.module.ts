import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from 'src/entities/user.entity';
import { Post } from 'src/entities/post.entity';
import { JwtModule } from '@nestjs/jwt';
import { AuthGuard } from '../../guards/auth.guard';
import { UsersModule } from '../users/users.module';
import { UsersService } from '../users/users.service';
import { MailModule } from '../mail-notification/mailNotification.module';

@Module({
  imports: [
    MailModule,
    UsersModule,
    TypeOrmModule.forFeature([User, Post]),
    JwtModule.register({
      secret: process.env.JWT_SECRET || 'temporarySecret',
      signOptions: { expiresIn: '1d' },
    }),
  ],
  controllers: [AuthController],
  providers: [AuthService, AuthGuard, UsersService],
  exports: [AuthService, JwtModule, AuthGuard],
})
export class AuthModule {}
