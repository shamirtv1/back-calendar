import { BadRequestException, HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { User, UserDocument } from './schemas/user.schema';
import { Model } from 'mongoose';
import * as argon2 from 'argon2';
import { SignupDto } from './dto/signup.dto';
import { LoginDto } from './dto/login.dto';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class AuthService {

  constructor(

    @InjectModel(User.name)
    private readonly userModel: Model<UserDocument>,

    private jwtService: JwtService

  ) { }



  async signup(signupDto: SignupDto): Promise<User> {

    const userQuery = await this.userModel.findOne<User>({ email: signupDto.email }).exec();

    if (userQuery !== null) {
      throw new HttpException(`Email: ${signupDto.email} has already been registered`, HttpStatus.BAD_REQUEST);
    }

    // TRANSFORMACION DEL PASSWORD
    const hashPassword = await argon2.hash(signupDto.password);

    // REGISTRO DE LA INFORMACION DEL NUEVO USUARIO
    const userCreate = await this.userModel.create({ ...signupDto, password: hashPassword });

    if (!userCreate) throw new HttpException('Error Registering User Try Again', HttpStatus.INTERNAL_SERVER_ERROR);

    return userCreate;

  }

  login(usuario: Partial<User>) {
    
    const payload = { username: usuario.email, sub: usuario._id };
    return {
      access_token: this.jwtService.sign(payload),
    };
  }



  async validateUser(username: string, pass: string): Promise<Partial<User>> {

    const user = await this.userModel.findOne<User>({ email: username });

    if (!user) throw new BadRequestException('Wrong email');

    const passwordMatches = await argon2.verify(user.password, pass);

    if (!passwordMatches) throw new BadRequestException('Password is incorrect');

    const { password, ...result } = user ;

    

    return (user && passwordMatches) ? result : null;
  }


}
