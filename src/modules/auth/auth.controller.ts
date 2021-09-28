import { LocalStorageConfig } from '@common/providers/storage/local-storage.config';
import { UserEntityConverter } from '@common/utils/UserEntityConverter';
import {
  Body,
  Controller,
  Get,
  HttpCode,
  Post,
  Req,
  Request,
  UploadedFile,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { FileInterceptor } from '@nestjs/platform-express';
import { AuthService } from './auth.service';
import { FormatPasswordDTO } from './DTOs/format-password.dto';
import { SignInDTO } from './DTOs/sign-in.dto';
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

  @Post('forgot-password')
  async forgotPassword(@Body() body: { email: string }) {
    await this.authService.forgotPassword(body);
    return;
  }

  @Post('format-password')
  async formatPassword(
    @Body()
    body: FormatPasswordDTO,
  ) {
    await this.authService.formatPassword(body);
    return;
  }
  @UseGuards(JwtAuthGuard)
  @Post('avatar')
  @UseInterceptors(FileInterceptor('avatar', LocalStorageConfig))
  updateAvatar(@UploadedFile() avatar: Express.Multer.File, @Req() req) {
    console.log({ avatar, user: req.user });
  }
}
