import { IsEmail, IsNotEmpty, IsStrongPassword } from 'class-validator';

export class AuthDto {
  @IsEmail()
  @IsNotEmpty()
  email: string;

  @IsStrongPassword({} ,{ message: 'Password insuficientemente fuerte'})
  @IsNotEmpty()
  password: string;
}