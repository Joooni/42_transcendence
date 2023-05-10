import { Controller, Get } from '@nestjs/common';
import { AppService } from './app.service';

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
}
