import { Injectable, Req, Res } from '@nestjs/common';
import { CreateAuthInput } from '../dto/create-auth.input';
import { UpdateAuthInput } from '../dto/update-auth.input';
import { UsersService } from 'src/users/users.service';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class AuthService {
  constructor(
    private usersService: UsersService,
    private configService: ConfigService
    ) {}

  async login(@Req() _req: any, @Res() _res: any): Promise<any> {
    var user = await this.usersService.findOne(_req.user.id);

    if(user.twoFAEnabled)
    {
      // two FA route goes here

      return ;
    }
    // Intra Login goes here
    return ;
    // should return a 42 signed JWT token
  }


  create(createAuthInput: CreateAuthInput) {
    return 'This action adds a new auth';
  }

  findAll() {
    return `This action returns all auth`;
  }

  findOne(id: number) {
    return `This action returns a #${id} auth`;
  }

  update(id: number, updateAuthInput: UpdateAuthInput) {
    return `This action updates a #${id} auth`;
  }

  remove(id: number) {
    return `This action removes a #${id} auth`;
  }
}
