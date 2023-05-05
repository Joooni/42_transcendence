import { Injectable } from '@nestjs/common';

@Injectable()
export class AppService {
  getHello(): string {
    return 'Hullo World!';
  }
  getLogin(): string {
    return '<html><button type="submit">Sign in</button></html>';
  }
}
