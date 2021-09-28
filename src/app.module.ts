import { Module } from '@nestjs/common';
import { UserModule } from './modules/user/user.module';
import { AuthModule } from './modules/auth/auth.module';
import { PrismaClient } from '.prisma/client';
import { ConfigModule } from '@nestjs/config';
import config from './config/config';
import { TokenModule } from '@modules/token/token.module';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true, load: [config] }),
    PrismaClient,
    UserModule,
    TokenModule,
    AuthModule,
  ],
})
export class AppModule {}
