import { Injectable } from '@nestjs/common';
import { compare, genSalt, hash as bHash } from 'bcrypt';

@Injectable()
export class HashProvider {
  async hash(data: string): Promise<string> {
    const rounds = 10;
    const salt = await genSalt(rounds);
    const dataHashed = await bHash(data, salt);

    return dataHashed;
  }

  async compare(data: string, hash: string): Promise<boolean> {
    return compare(data, hash);
  }
}
