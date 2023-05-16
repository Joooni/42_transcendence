import { Injectable, Req, Res } from '@nestjs/common';
import { UsersService } from 'src/users/users.service';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class AuthService {
  constructor(
    private usersService: UsersService,
    private configService: ConfigService,
  ) {}

  async login(@Req() _req: any, @Res() _res: any): Promise<any> {
    console.log(_req);
    console.log(_res);
    const user = await this.usersService.findOne(_req.user.id);
    if (!user)
      // return or throw erorr
      // if(user.twoFAEnabled == true)
      // {
      //   // two FA route goes here
      //   return user;
      // }
      // Intra Login goes here
      return;
    // should return a 42 signed JWT token
  }
}
