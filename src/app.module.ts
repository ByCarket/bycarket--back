import { Module } from '@nestjs/common';
import typeormConfig from './config/typeorm.config';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule, TypeOrmModuleOptions } from '@nestjs/typeorm';
import { AuthModule } from './modules/auth/auth.module';
import { UsersModule } from './modules/users/users.module';
import { PostsModule } from './modules/posts/posts.module';
import { VehiclesModule } from './modules/vehicles/vehicles.module';
import * as dotenv from 'dotenv';
import { SeederModule } from './modules/seeder/seeder.module';
import { YearOptionsModule } from './modules/year-option/year-options.module';
import { BrandsModule } from './modules/brands/brands.module';
import { ModelsModule } from './modules/models/models.module';
import { VersionsModule } from './modules/versions/versions.module';


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
    AuthModule,
    UsersModule,
    PostsModule,
    VehiclesModule,
    SeederModule,
    BrandsModule,
    ModelsModule,
    VersionsModule,
    YearOptionsModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}


