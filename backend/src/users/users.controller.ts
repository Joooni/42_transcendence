import { Controller } from '@nestjs/common';
import { UsersService } from './users.service';
import { ConfigService } from '@nestjs/config';

@Controller('users')
export class UsersController {
  constructor(
    private readonly usersService: UsersService,
    private readonly configService: ConfigService,
  ) {}
}
