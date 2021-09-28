import { IsNotEmpty, IsString, Length } from 'class-validator';

export class FormatPasswordDTO {
  @IsNotEmpty()
  token: string;

  @IsString()
  @Length(8)
  password: string;

  @IsString()
  @Length(8)
  password_confirmation: string;
}
