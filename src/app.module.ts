import { Module } from '@nestjs/common';
import typeormConfig from './config/typeorm.config';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule, TypeOrmModuleOptions } from '@nestjs/typeorm';
import { AuthModule } from './modules/auth/auth.module';
import { UsersModule } from './modules/users/users.module';
import { PostsModule } from './modules/posts/posts.module';
import { VehiclesModule } from './modules/vehicles/vehicles.module';
import { JwtModule } from '@nestjs/jwt';
import * as dotenv from 'dotenv';

dotenv.config({ path: '.env.development' });

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      load: [typeormConfig],
    }),
    TypeOrmModule.forRootAsync({
      inject: [ConfigService],
      useFactory: (configService: ConfigService): TypeOrmModuleOptions => {
        const config = configService.get<TypeOrmModuleOptions>('typeorm');
        return config as TypeOrmModuleOptions;
      },
    }),
    JwtModule.register({
    global: true,
    signOptions: { expiresIn: "1d" },
    secret: process.env.JWT_SECRET,
  }),
    AuthModule,
    UsersModule,
    PostsModule,
    VehiclesModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
