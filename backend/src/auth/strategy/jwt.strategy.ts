import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ConfigService } from '@nestjs/config';
import { Strategy } from 'passport-jwt';
import { Request } from 'express';

export interface JwtPayload {
  id: number;
  email: string;
  isAuthenticated: boolean;
}

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(private readonly configService: ConfigService) {
    super({
      jwtFromRequest: JwtStrategy.cookieExtractor,
      secretOrKey: configService.get<string>('JWT_SECRET'),
      ignoreExpiration: false,
    });
  }

  private static cookieExtractor(req: Request): string | null {
    let token: string | null = null;
    if (req && req.cookies) {
      token = req.cookies['jwt'];
    }
    return token;
  }

  async validate(payload: any): Promise<any> {
    return payload;
  }
}
