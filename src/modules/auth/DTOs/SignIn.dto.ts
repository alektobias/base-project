import { IsEmail, IsNotEmpty, Length } from 'class-validator';

export class SignInDTO {
  @IsEmail()
  email: string;

  @Length(8)
  password: string;

  @IsNotEmpty()
  name: string;
}
