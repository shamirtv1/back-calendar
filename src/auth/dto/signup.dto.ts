import { IsEmail, IsNotEmpty, IsString, IsStrongPassword } from 'class-validator';

export class SignupDto {
  @IsString()
  @IsNotEmpty({ message: 'Nombre no puede ser vacio'})
  name: string;

  @IsEmail()
  @IsNotEmpty()
  email: string;

  @IsStrongPassword({} ,{ message: 'Password insuficientemente fuerte'})
  @IsNotEmpty()
  password: string;
}