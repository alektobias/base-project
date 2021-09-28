import { Prisma } from '.prisma/client';
import { Injectable } from '@nestjs/common';
import { PrismaClient } from '@common/clients/prisma/prisma.client';

@Injectable()
export class TokenRepository {
  constructor(private prisma: PrismaClient) {}

  async create(data: Prisma.TokenCreateInput) {
    return this.prisma.token.create({ data });
  }

  async get(tokenWhereUnique: Prisma.TokenWhereUniqueInput) {
    return this.prisma.token.findUnique({ where: tokenWhereUnique });
  }
  async delete(tokenWhereUnique: Prisma.TokenWhereUniqueInput) {
    return this.prisma.token.delete({ where: tokenWhereUnique });
  }
}
