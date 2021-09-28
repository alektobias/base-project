import { PrismaModule } from '@common/clients/prisma/prisma.module';
import { Module } from '@nestjs/common';
import { TokenRepository } from './token.repository';

@Module({
  imports: [PrismaModule],
  providers: [TokenRepository],
  exports: [TokenRepository],
})
export class TokenModule {}
