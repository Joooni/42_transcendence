import {
  Controller,
  Get,
  Req,
  Res,
  BadRequestException,
  UseGuards,
} from '@nestjs/common';
import { Response } from 'express';
import { CreateUserInput } from 'src/users/dto/create-user.input';
import { User } from '../../users/entities/user.entity';
import { Intra42OAuthGuard } from '../guard/intra42.guard';
import { UsersService } from '../../users/users.service';
import { EntityNotFoundError } from 'typeorm';
import { JwtService } from '@nestjs/jwt';
import { JwtPayload } from '../strategy/jwt.strategy';

@Controller('auth')
export class Intra42Controller {
  constructor(
    private readonly usersService: UsersService,
    private readonly jwtService: JwtService,
  ) {}

  @Get('login')
  @UseGuards(Intra42OAuthGuard)
  login(): void {
    console.log('login here');
    return;
  }

  @Get('callback')
  @UseGuards(Intra42OAuthGuard)
  async callback(@Req() req: any, @Res({ passthrough: true }) res: Response) {
    console.log('inside callback');
    if (typeof req.user == 'undefined')
      throw new BadRequestException('Verification with 42Intra failed');

    let user: User | CreateUserInput = req.user;
    console.log('/auth/callback user: ', user);
    try {
      user = await this.usersService.findOne(+user.id);
    } catch (error) {
      if (error instanceof EntityNotFoundError) {
        await this.usersService.create(user);
      } else {
        throw error;
      }
    }

    console.log('after user finding block');

    const payload = {
      id: user.id,
      email: user.email,
      isAuthenticated: !user.twoFAEnabled,
    };

    console.log('after definition of payload');
    // signs a JSON Web Token (JWT) with the payload from registered user
    // JwtPayload as an interface is used to ensure correct object shape and allow static type checking
    // then, create a cookie called 'jwt' with the signed token and set it to httpOnly mode to mitigate
    // risks of cross-site scripting (XSS) attacks
    const jwt_token = this.jwtService.sign(payload as JwtPayload);
    console.log('jwt token: ', jwt_token);
    res.cookie('jwt', jwt_token, { httpOnly: true });
    console.log('auth.controller.res: ', res);
    return { isAuthenticated: !user.twoFAEnabled };
  }

  @Get('logout')
  logout(@Res({ passthrough: true }) res: Response): void {
    console.log('logout route');
    res.clearCookie('jwt', { httpOnly: true });
  }
}
