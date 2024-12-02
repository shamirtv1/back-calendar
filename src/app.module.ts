import { Module } from '@nestjs/common';
import { AuthModule } from './auth/auth.module';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';
import { IncidentModule } from './incident/incident.module';
import { Connection } from 'mongoose';

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
        authSource: 'admin',
        onConnectionCreate: (connection: Connection) => {
          connection.on('connected', () => console.log('MongoDB Connected'));
          connection.on('open', () => console.log('MongoDB Open'));
          connection.on('disconnected', () => console.log('MongoDB Disconnected'));
          connection.on('reconnected', () => console.log('MongoDB Reconnected'));
          connection.on('disconnecting', () => console.log('MongoDB Disconnecting'));
          return connection;
        },
      }),
      inject: [ConfigService],
    }),
    AuthModule,
    IncidentModule
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
