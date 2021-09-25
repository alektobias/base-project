import { UserEntityConverter } from '@common/utils/UserEntityConverter';
import {
  Body,
  Controller,
  Get,
  HttpCode,
  Post,
  Request,
  UseGuards,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { AuthService } from './auth.service';
import { SignInDTO } from './DTOs/SignIn.dto';
import { JwtAuthGuard } from './guards/jwt.guard';
import LocalAuthGuard from './guards/local-auth.guard';

@Controller('/auth')
export class AuthController {
  constructor(
    private authService: AuthService,
    private jwtService: JwtService,
  ) {}

  @UseGuards(LocalAuthGuard)
  @Post('/login')
  @HttpCode(200)
  async logIn(@Request() req) {
    const user = UserEntityConverter(req.user);
    return { token: this.jwtService.sign(user), ...user };
  }

  @Post('/signin')
  @HttpCode(201)
  async signin(@Body() body: SignInDTO) {
    const newAccount = await this.authService.createAccount(body);
    return UserEntityConverter(newAccount);
  }

  @UseGuards(JwtAuthGuard)
  @Get('profile')
  getProfile(@Request() req) {
    return req.user;
  }
}
