import { Module } from '@nestjs/common';
import { Intra42Controller } from './controller/auth.controller';
import { UsersModule } from 'src/users/users.module';
import { Intra42Strategy } from './strategy/intra42strategy';
import { JwtStrategy } from './strategy/jwt.strategy';
import { ConfigService } from '@nestjs/config';
import { JwtModule } from '@nestjs/jwt';
import { HttpModule } from '@nestjs/axios';
import { AuthService } from './service/auth.service';
import { TwoFAController } from './controller/twoFA.controller';
import { TwoFAService } from './service/twoFA.service';
@Module({
  imports: [
    HttpModule,
    UsersModule,
    JwtModule.registerAsync({
      useFactory: async (configService: ConfigService) => {
        return {
          secret: configService.get<string>('JWT_SECRET'),
          signOptions: {
            expiresIn: configService.get<string>('JWT_EXPIRES_IN'),
          },
        };
      },
      inject: [ConfigService],
    }),
  ],
  providers: [
    JwtStrategy,
    Intra42Strategy,
    ConfigService,
    AuthService,
    TwoFAService,
  ],
  controllers: [Intra42Controller, TwoFAController],
})
export class AuthModule {}
