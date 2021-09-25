import { User } from '.prisma/client';
import { Exclude, Type } from 'class-transformer';
import { IsDate, IsEmail, Length } from 'class-validator';

export class UserEntity implements User {
  @Exclude({ toPlainOnly: true })
  id: string;
  @IsEmail()
  email: string;

  name: string;

  @Length(8)
  @Exclude({ toPlainOnly: true })
  password: string;

  avatar_url: string;
  @IsDate()
  @Exclude({ toPlainOnly: true })
  @Type(() => Date)
  createdAt: Date;

  @IsDate()
  @Exclude({ toPlainOnly: true })
  @Type(() => Date)
  updatedAt: Date;
}
