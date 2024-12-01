import { BadRequestException, HttpException, HttpStatus, Injectable, UnauthorizedException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { User, UserDocument } from './schemas/user.schema';
import { Model } from 'mongoose';
import * as argon2 from 'argon2';
import { JwtService } from '@nestjs/jwt';
import { CreateUserDto } from './dto/create-user.dto';
import { ConfigService } from '@nestjs/config';
import { ACCES_TOKEN_LIFETIME, REFRESH_TOKEN_LIFETIME } from 'src/constants';
import { ObjectId } from 'typeorm';

@Injectable()
export class AuthService {

  constructor(

    @InjectModel(User.name)
    private readonly userModel: Model<UserDocument>,

    private jwtService: JwtService,
    private configService: ConfigService

  ) { }


  /**
      * Add new user
    */
  async signup(createUserDto: CreateUserDto): Promise<User> {

    const userQuery = await this.userModel.findOne<User>({ email: createUserDto.email }).exec();

    if (userQuery !== null)
      throw new HttpException(`Email: ${createUserDto.email} has already been registered`, HttpStatus.BAD_REQUEST);

    // TRANSFORMACION DEL PASSWORD
    const hashPassword = await this.hashData(createUserDto.password);

    // REGISTRO DE LA INFORMACION DEL NUEVO USUARIO
    const userCreate = await this.userModel.create({ ...createUserDto, password: hashPassword });

    if (!userCreate) throw new HttpException('Error Registering User Try Again', HttpStatus.INTERNAL_SERVER_ERROR);

    return userCreate;

  }

  /**
    * generate new credential for a user
  */
  localSignin = async (user: Partial<User>) => await this.getTokens(user);


  /**
      * Revalidate token
    */
  refreshTokens = async (user: Partial<User>) => await this.getTokens(user);


  /**
    * Current user information
  */
  me = async (sub: string) => await this.userModel.findById(sub).select(['-password']);


  /**
     * Validate user credentials
   */
  async validateUser(email: string, pass: string): Promise<Partial<User>> {

    const user = await this.userModel.findOne<User>({ email });

    if (!user)
      throw new BadRequestException('Wrong email');

    const passwordMatches = await this.verifyData(user.password, pass);

    if (!passwordMatches)
      throw new BadRequestException('Password is incorrect');

    return (user && passwordMatches) ? user : null;
  }


  /**
     * Validate refreshtoken
   */
  async validateRefreshToken(refreshToken: string) {
    try {
      const payload = this.jwtService.verify(refreshToken,
        { secret: this.configService.get<string>('JWT_REFRESH_SECRET') }
      )
      return await this.userModel.findById(payload.sub).select(['-password']);
    } catch (error) {
      throw new UnauthorizedException();
    }

  }


  /**
   * Data encrypt
   */
  hashData = (data: string) => argon2.hash(data);


  /**
   * Verify the authenticity of an encrypted string with an unauthenticated one
   */
  verifyData = (stringHash: string, stringPlain: string) => argon2.verify(stringHash, stringPlain);


  /**
   * Access token generator and refresh token
   */
  async getTokens(user: Partial<User>) {

    const payload = { sub: user._id, email: user.email };

    const [accessToken, refreshToken] = await Promise.all([
      this.jwtService.signAsync(payload,
        {
          secret: this.configService.get<string>('JWT_ACCESS_SECRET'),
          expiresIn: ACCES_TOKEN_LIFETIME,
        },
      ),
      this.jwtService.signAsync(payload,
        {
          secret: this.configService.get<string>('JWT_REFRESH_SECRET'),
          expiresIn: REFRESH_TOKEN_LIFETIME,
        },
      ),
    ]);



    return { accessToken, refreshToken };
  }

}
