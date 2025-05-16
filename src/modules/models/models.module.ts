import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Model } from 'src/entities/model.entity';
import { Brand } from 'src/entities/brand.entity';
import { ModelsService } from './models.service';
import { ModelsController } from './models.controller';
import { AuthModule } from '../auth/auth.module';
import { UsersService } from '../users/users.service';
import { User } from 'src/entities/user.entity';
import { Post } from 'src/entities/post.entity';
import { UsersModule } from '../users/users.module';
import { PostsModule } from '../posts/posts.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([Model, Brand, User, Post]),
    AuthModule,
    UsersModule,
    PostsModule,
  ],
  providers: [ModelsService],
  controllers: [ModelsController],
})
export class ModelsModule {}
