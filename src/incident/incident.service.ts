import { BadRequestException, HttpException, HttpStatus, Injectable, UnauthorizedException } from '@nestjs/common';
import { CreateIncidentDto } from './dto/create-incident.dto';
import { UpdateIncidentDto } from './dto/update-incident.dto';
import { Incident, IncidentDocument } from './schemas/incident.schema';
import { Model, ObjectId, Types } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';
import { User, UserDocument } from 'src/auth/schemas/user.schema';

@Injectable()
export class IncidentService {


  constructor(
    @InjectModel(User.name) private readonly userModel: Model<UserDocument>,
    @InjectModel(Incident.name) private readonly incidentModel: Model<IncidentDocument>
  ) { }


  async create(createIncidentDto: CreateIncidentDto, uderId: string) {

    const user = await this.userModel.findById(uderId);

    if (!user)
      throw new BadRequestException('User Wrong'); //VALIDATE USER

    const incident = await this.incidentModel.create({ ...createIncidentDto, user: user._id })

    return incident;
  }


  async findAll(uderId: string) {

    const user = await this.userModel.findById(uderId);

    if (!user)
      throw new BadRequestException('User Wrong'); //VALIDATE USER

    const incidents = await this.incidentModel.find({ user: user._id }).populate('user', '-password');

    return incidents;
  }



  findOne(id: number) {
    return `This action returns a #${id} incident`;
  }

  async update(id: string, updateIncidentDto: UpdateIncidentDto, userId: string) {

    const incident = await this.incidentModel.findById(id);

    if (!incident)
      throw new HttpException(`Incident no valid`, HttpStatus.NOT_FOUND);

    try {
      if (!incident.user._id.equals(new Types.ObjectId(userId)))
        throw new UnauthorizedException('User no valid');
    } catch (e) {
      throw new UnauthorizedException('User no valid');
    }

    const dataUpdate = {
      ...updateIncidentDto, user: new Types.ObjectId(userId)
    }

    return await this.incidentModel.findByIdAndUpdate(id, dataUpdate, { new: true })

  }

  async remove(id: string, userId: string) {
    const incident = await this.incidentModel.findByIdAndDelete(id);
    if(!incident) 
      throw new HttpException(`Incident not found`, HttpStatus.NOT_FOUND);
    return incident
  }
}
