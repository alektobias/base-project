import { Prisma, User } from '.prisma/client';
import { BadRequestException, Injectable } from '@nestjs/common';
import { HashProvider } from '@common/providers/hash/hash.provider';
import { SignInDTO } from './DTOs/sign-in.dto';
import { MailProducer } from '@common/providers/queue/mail/mail.producer';
import { UserRepository } from '@modules/user/user.repository';
import { TokenRepository } from '@modules/token/token.repository';
import { classToPlain } from 'class-transformer';
import { UserEntity } from '@modules/user/entities/user.entity';
import { ConfigService } from '@nestjs/config';
import { FormatPasswordDTO } from './DTOs/format-password.dto';
import * as dayjs from 'dayjs';
@Injectable()
export class AuthService {
  constructor(
    private configService: ConfigService,
    private userRepository: UserRepository,
    private tokenRepository: TokenRepository,
    private hashProvider: HashProvider,
    private mailProducer: MailProducer,
  ) {}

  async userVerification(data: Prisma.UserWhereUniqueInput) {
    const user = await this.userRepository.getUser(data);

    if (!user) throw new BadRequestException('Email not registred!');

    return user;
  }

  async validateUser({
    email,
    password,
  }: Record<'email' | 'password', string>) {
    const user = await this.userRepository.getUser({ email });

    if (!user) throw new BadRequestException('Email/Password are incorret!');

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

    const userAlreadyExist = await this.userRepository.getUser({ email });

    if (userAlreadyExist)
      throw new BadRequestException('This email is already registered!');

    const hashPassword = await this.hashProvider.hash(password);

    const user = { ...data, password: hashPassword } as User;

    const newUser = await this.userRepository.create(user);

    return newUser;
  }

  testeMail() {
    // return { path: process.cwd() + '/src/common/templates' };
    return this.mailProducer.sendMail({
      to: 'hermina.pagac44@ethereal.email',
      from: 'Alek Tobias <alektobias@dev.com>',
      context: {
        msg: 'msg 55454555',
      },
      subject: 'subject',
      template: './template',
      text: 'text',
    });
  }

  async forgotPassword({ email }: { email: string }) {
    const user = await this.userVerification({ email });

    const token = await this.tokenRepository.create({
      userId: user.id,
      expiresIn: '1d',
    });

    await this.mailProducer.sendMail({
      from: 'Base Project <baseproject@dev.com>',
      to: user.email,
      context: {
        ...classToPlain(user as UserEntity),
        token: token.id,
        url: this.configService.get('APP_FRONT_URL'),
      },
      subject: 'Reset Password',
      template: './reset-password',
      text: 'reset password',
    });

    return;
  }
  // TEM QUE FAZER A VERIFICA"CAO COM O CLAS VALIDATOR
  async formatPassword({
    token,
    password,
    password_confirmation,
  }: FormatPasswordDTO) {
    if (password !== password_confirmation)
      throw new BadRequestException(
        'Password and Password confirmation do not match!',
      );

    const tokenExists = await this.tokenRepository.get({ id: token });

    if (!tokenExists) throw new BadRequestException('Invalid Token!');

    const type = tokenExists.expiresIn.slice(-1);
    const value = +tokenExists.expiresIn.replace(type, '');

    const tokenExpiration = dayjs(tokenExists.createdAt).add(value, type);

    const now = new Date();

    const isExpired = dayjs(now).isAfter(tokenExpiration);

    if (isExpired) {
      await this.tokenRepository.delete({ id: token });
      throw new BadRequestException('Token Expired!');
    }

    const user = await this.userVerification({ id: tokenExists.userId });
    const hashedPassword = await this.hashProvider.hash(password);

    await this.userRepository.update({
      where: { id: user.id },
      data: {
        ...classToPlain(user as UserEntity),
        password: hashedPassword,
      },
    });
    await this.tokenRepository.delete({ id: token });

    return;
  }
  // validateJWT() {}
}
