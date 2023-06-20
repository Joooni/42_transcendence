import { PassportStrategy } from '@nestjs/passport';
import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
/* eslint-disable */
// since passport-42 has no @types package, tell the compiler to ignore this error, otherwise no bueno
// @ts-ignore
import { Strategy, VerifyCallback } from 'passport-42';
import { CreateUserInput } from 'src/users/dto/create-user.input';
/* eslint-enable */
@Injectable()
export class Intra42Strategy extends PassportStrategy(Strategy, 'intra42') {
  constructor(private readonly configService: ConfigService) {
    // super() calls parent class constructor and is used to initialize additional stuff for the instance of PassportStrategy
    super({
      clientID: configService.get<string>('INTRA42_AUTH_ID'),
      clientSecret: configService.get<string>('INTRA42_AUTH_SECRET'),
      callbackURL: configService.get<string>('INTRA42_AUTH_CALLBACK_URL'),
      scope: ['public'],
    });
  }

  async validate(
    accessToken: string,
    refreshToken: string,
    profile: any,
    done: VerifyCallback,
  ): Promise<void> {
    const user: CreateUserInput = {
      id: +profile.id,
      intra: profile.username,
      firstname: profile.name.givenName,
      lastname: profile.name.familyName,
      username: profile.username,
      twoFAEnabled: false,
      email: profile.emails[0].value,
      picture: profile._json.image.link,
      status: profile.status,
      wins: profile.wins,
      losses: profile.losses,
    };
    done(null, { ...user, accessToken });
  }
}
