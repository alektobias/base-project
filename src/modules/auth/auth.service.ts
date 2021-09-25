import { Prisma } from '.prisma/client';
import { UserService } from '@modules/user/user.service';
import { BadRequestException, Injectable } from '@nestjs/common';
import { HashProvider } from '@common/providers/hash/hash.provider';
import { SignInDTO } from './DTOs/SignIn.dto';

@Injectable()
export class AuthService {
  constructor(
    private userService: UserService,
    private hashProvider: HashProvider,
  ) {}

  async userVerification(data: Prisma.UserWhereUniqueInput) {
    const user = await this.userService.getUser(data);

    if (!user) throw new BadRequestException('Email/Password are incorret!');

    return user;
  }

  async validateUser({
    email,
    password,
  }: Record<'email' | 'password', string>) {
    const user = await this.userVerification({ email });

    const validPassword = await this.hashProvider.compare(
      password,
      user.password,
    );
    if (!validPassword)
      throw new BadRequestException('Email/Password are incorret!');

    return user;
  }

  async createAccount(data: SignInDTO) {
    const { email, password } = data;

    const userAlreadyExist = await this.userService.getUser({ email });

    if (userAlreadyExist)
      throw new BadRequestException('This email is already registered!');

    const hashPassword = await this.hashProvider.hash(password);

    const user = { ...data, password: hashPassword };

    const newUser = await this.userService.create(user);

    return newUser;
  }

  // validateJWT() {}
}
