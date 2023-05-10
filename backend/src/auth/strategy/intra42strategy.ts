import { PassportStrategy } from "@nestjs/passport";
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { AuthService } from '../service/auth.service';
import { ConfigService } from "@nestjs/config";
/* eslint-disable */
// since passport-42 has no @types package, tell the compiler to ignore this error, otherwise no bueno
// @ts-ignore
import { Strategy, VerifyCallback } from 'passport-42';
import { CreateUserInput } from "src/users/dto/create-user.input";
/* eslint-enable */
@Injectable()
export class Intra42Strategy extends PassportStrategy(Strategy, 'intra42') {
	constructor(private configService: ConfigService) {
		// super() calls parent class constructor and is used to initialize additional stuff for the instance of PassportStrategy
		super({
			clientID: configService.get<string>('INTRA42_AUTH_ID'),
			clientSecret: configService.get<string>('INTRA42_AUTH_SECRET'),
			callbackURL: "http://localhost:3000/login-callback",
		});
		console.log("client id: %s",configService.get<string>('INTRA42_AUTH_ID'));
		console.log("auth secret: %s",configService.get<string>('INTRA42_AUTH_SECRET'));
	}

	async validate(
		accessToken: string,
		refreshToken: string,
		profile: any,
		done: VerifyCallback,
	): Promise<any> {
		console.log("access token: %s", accessToken);
		console.log("refesh token: %s", refreshToken);
		const user: CreateUserInput = {
			id: +profile.id,
			intra: profile.username,
			firstname: profile.first_name,
			lastname: profile.last_name,
			username: profile.unsername,
			twoFAEnabled: false,
			email: profile.email,
			picture: profile.picture,
			status: profile.status,
			wins: profile.wins,
			losses: profile.losses
		}
		done(null, {...user, accessToken });
	}
}