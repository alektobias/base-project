// src/prisma/prisma.module.ts
import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { PrismaClient } from './prisma.client';

@Module({
  imports: [ConfigModule],
  providers: [PrismaClient],
  exports: [PrismaClient],
})
export class PrismaModule {}
