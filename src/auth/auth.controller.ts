import { Controller, Post, Body, HttpCode, HttpStatus, Request, Get, UseGuards, Headers } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthDto } from './dto/auth.dto';
import { Public } from 'src/decorators/public.decorator';
import { RefreshTokenGuard } from './guards/refreshToken.guard';
import { CreateUserDto } from './dto/create-user.dto';
import { LocalAuthGuard } from './guards/local-auth.guard';
import { User } from './schemas/user.schema';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) { }

  @Public()
  @Post('signup')
  signUp(@Body() createUserDto: CreateUserDto) {
    return this.authService.signup(createUserDto);
  }


  @Public()
  @UseGuards(LocalAuthGuard)
  @HttpCode(HttpStatus.OK)
  @Post('signin')
  logIn(@Request() req: any) {
    return this.authService.localSignin(req.user);
  }


  @Public()
  @UseGuards(RefreshTokenGuard)
  @Get('refresh-token')
  refreshTokens(@Request() req: any) {
    return this.authService.refreshTokens(req.user);

  }


  @Get('me')
  me(@Request() req: any): Promise<Partial<User>> {
    const sub: string = req.user['sub'];
    return this.authService.me(sub);
  }

}
