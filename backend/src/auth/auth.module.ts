import { Module } from '@nestjs/common';
import { AuthService } from './service/auth.service';
import { AuthResolver } from './auth.resolver';
import { AuthController } from './controller/auth.controller';
import { UsersModule } from 'src/users/users.module';

@Module({
  imports: [UsersModule],
  providers: [AuthResolver, AuthService],
  controllers: [AuthController],

})
export class AuthModule {}
