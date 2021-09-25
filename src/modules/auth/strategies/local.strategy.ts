import { UserEntity } from '@modules/user/entities/user.entity';
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { Strategy } from 'passport-local';
import { AuthService } from '../auth.service';

@Injectable()
export class LocalStrategy extends PassportStrategy(Strategy) {
  constructor(private authService: AuthService) {
    super({ usernameField: 'email' });
  }

  async validate(email: string, password: string): Promise<UserEntity> {
    console.log({ email, password });
    const user = await this.authService.validateUser({ email, password });
    if (!user) throw new UnauthorizedException('SWUI');

    return user;
  }
}
