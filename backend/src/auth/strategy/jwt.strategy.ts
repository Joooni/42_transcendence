import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ConfigService } from '@nestjs/config';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { Request } from 'express';

export interface JwtPayload {
  id: number;
  email: string;
  isAuthenticated: boolean;
}

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(private readonly configService: ConfigService) {
    const cookieExtractor = (req: Request): string | null => {
      let token: string | null = null;
      if (req && req.cookies) {
        token = req.cookies['jwt'];
      } else if (req?.headers?.authorization) {
        token = req.headers.authorization;
      }
      return token;
    };

    super({
      jwtFromRequest: cookieExtractor,
      ignoreExpiration: false,
      secretOrKey: configService.get<string>('JWT_SECRET'),
    });
  }

  async validate(payload: any): Promise<any> {
    console.log('payload = ', payload);
    return payload;
  }
}
