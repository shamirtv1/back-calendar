import { Module } from '@nestjs/common';
import { AuthModule } from './auth/auth.module';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    MongooseModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: async (configService: ConfigService) => ({
        uri: configService.get<string>('MONGODB_URL'),
        //user: configService.get<string>('MONGODB_USER'),
        //pass: configService.get<string>('MONGODB_PASS'),
        retryWrites: true,
        authSource: 'admin'
      }),
      inject: [ConfigService],
    }),
    AuthModule
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
