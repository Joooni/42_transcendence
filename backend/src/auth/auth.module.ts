import { Module } from '@nestjs/common';
import { AuthService } from './service/auth.service';
import { Intra42Controller } from './controller/auth.controller';
import { UsersModule } from 'src/users/users.module';
import { Intra42Strategy } from './strategy/intra42strategy';
import { ConfigService } from '@nestjs/config';

@Module({
  imports: [UsersModule],
  providers: [AuthService, Intra42Strategy, ConfigService],
  controllers: [Intra42Controller],

})
export class AuthModule {}
