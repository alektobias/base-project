import { UserEntity } from '@modules/user/entities/user.entity';
import { classToPlain, plainToClass } from 'class-transformer';

export const UserEntityConverter = (data: any) => {
  return classToPlain(plainToClass(UserEntity, data));
};
