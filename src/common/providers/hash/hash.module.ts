import { Module } from '@nestjs/common';
import { HashProvider } from '@common/providers/hash/hash.provider';

@Module({
  exports: [HashProvider],
})
export class HashModule {}
