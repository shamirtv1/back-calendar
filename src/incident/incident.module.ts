import { Module } from '@nestjs/common';
import { IncidentService } from './incident.service';
import { IncidentController } from './incident.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { Incident, IncidentSchema } from './schemas/incident.schema';
import { AuthModule } from 'src/auth/auth.module';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: Incident.name, schema: IncidentSchema }]),
    AuthModule
  ],
  controllers: [IncidentController],
  providers: [IncidentService],
}) 
export class IncidentModule {}
