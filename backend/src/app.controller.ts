import { Controller, Get, UseGuards } from '@nestjs/common';
import { AppService } from './app.service';
import { JwtAuthGuard } from './auth/guard/jwt.guard';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}
  @Get('/login')
  login() {
    return this.appService.getLogin();
  }

  @Get()
  getHello(): string {
    return this.appService.getHello();
  }

  @Get('login-callback')
  getLoginCallback(): string {
    return this.appService.getLoginCallback();
  }

  @Get('test_jwt')
  @UseGuards(JwtAuthGuard)
  testJwt(): string {
    return 'test_jwt reached, you have to be authenticated for this!';
  }
}
