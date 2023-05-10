import { Injectable } from '@nestjs/common';

@Injectable()
export class AppService {
  getHello(): string {
    return 'Uh yeah, that shit works now too though it is quite slow!\n also Hello World!';
  }
  getLogin(): string {
    return '<html><button type="submit">Sign in</button></html>';
  }

  getLoginCallback(): string {
    return '<p align="center"><img style="position: relative; bottom: 20px;" src="https://media.tenor.com/Bq2aAQc8gOQAAAAM/bird-dance.gif"/>Login successful I guess? At least redirection was!</p>';
  }
}
