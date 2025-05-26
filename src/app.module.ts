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
import { SeederModule } from './modules/seeder/seeder.module';
import { BrandsModule } from './modules/brands/brands.module';
import { ModelsModule } from './modules/models/models.module';
import { VersionsModule } from './modules/versions/versions.module';
import { PassportModule } from '@nestjs/passport';
import { FilesModule } from './modules/files/files.module';
import { BillingModule } from './modules/billing/billing.module';
import stripeConfig from './config/stripe.config';
import { MailModule } from './modules/mail-notification/mailNotification.module';
import { PricesModule } from './modules/prices/prices.module';
import { MeliModule } from './modules/meli/meli.module';

dotenv.config();

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      load: [typeormConfig],
      ignoreEnvFile: true,
    }),
    TypeOrmModule.forRootAsync({
      inject: [ConfigService],
      useFactory: (configService: ConfigService): TypeOrmModuleOptions => {
        const config = configService.get<TypeOrmModuleOptions>('typeorm');
        console.log('DB_HOST usado:', process.env.DB_HOST);
        console.log('TypeORM config:', configService.get<TypeOrmModuleOptions>('typeorm'));
        return config as TypeOrmModuleOptions;
      },
    }),
    JwtModule.register({
      global: true,
      signOptions: { expiresIn: '1d' },
      secret: process.env.JWT_SECRET,
    }),
    PassportModule.register({ defaultStrategy: 'jwt' }),
    AuthModule,
    UsersModule,
    PostsModule,
    VehiclesModule,
    SeederModule,
    BrandsModule,
    ModelsModule,
    VersionsModule,
    FilesModule,
    BillingModule,
    MeliModule,
    PricesModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
