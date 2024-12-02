import { Controller, Get, Post, Body, Patch, Param, Delete, Request  } from '@nestjs/common';
import { IncidentService } from './incident.service';
import { CreateIncidentDto } from './dto/create-incident.dto';
import { UpdateIncidentDto } from './dto/update-incident.dto';

@Controller('incident')
export class IncidentController {
  constructor(private readonly incidentService: IncidentService) {}

  @Post()
  create(@Body() createIncidentDto: CreateIncidentDto, @Request() req: any) {
    const uderId = req.user['sub'];
    return this.incidentService.create(createIncidentDto, uderId);
  }

  @Get()
  findAll(@Request() req: any) {
    const uderId = req.user['sub'];
    return this.incidentService.findAll(uderId);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.incidentService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateIncidentDto: UpdateIncidentDto, @Request() req: any) {
    const userId = req.user['sub'];
    return this.incidentService.update(id, updateIncidentDto, userId);
  }

  @Delete(':id')
  remove(@Param('id') id: string, @Request() req: any) {
    const userId = req.user['sub'];
    return this.incidentService.remove(id, userId);
  }
}
