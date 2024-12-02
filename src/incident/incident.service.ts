import { BadRequestException, Injectable } from '@nestjs/common';
import { CreateIncidentDto } from './dto/create-incident.dto';
import { UpdateIncidentDto } from './dto/update-incident.dto';
import { Incident, IncidentDocument } from './schemas/incident.schema';
import { Model } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';
import { User, UserDocument } from 'src/auth/schemas/user.schema';

@Injectable()
export class IncidentService {


  constructor(
    @InjectModel(User.name) private readonly userModel: Model<UserDocument>,
    @InjectModel(Incident.name) private readonly incidentModel: Model<IncidentDocument>
  ){}


  async create(createIncidentDto: CreateIncidentDto, uderId: string) {

    const user = await this.userModel.findById(uderId);
    
    if(!user) 
      throw new BadRequestException('User Wrong'); //VALIDATE USER

    const incident = await this.incidentModel.create({ ...createIncidentDto, user: user._id })
    
    return incident;
  }


  async findAll(uderId: string) {

    const user = await this.userModel.findById(uderId);

    if(!user) 
      throw new BadRequestException('User Wrong'); //VALIDATE USER

    const incidents = await this.incidentModel.find({ user: user._id });
    
    return incidents;
  }



  findOne(id: number) {
    return `This action returns a #${id} incident`;
  }

  update(id: number, updateIncidentDto: UpdateIncidentDto) {
    return `This action updates a #${id} incident`;
  }

  remove(id: number) {
    return `This action removes a #${id} incident`;
  }
}
