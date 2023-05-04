import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthResolver } from './auth.resolver';
import { Controller } from './controller/auth.controller';

@Module({
  providers: [AuthResolver, AuthService],
  controllers: [Controller]
})
export class AuthModule {}
