import { ExecutionContext, Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Observable } from 'rxjs';
import { AuthGuard } from '@nestjs/passport';
import { mockUser1 } from 'src/users/entities/user.entity.mock';

@Injectable()
export class Intra42OAuthGuard extends AuthGuard('intra42') {
  constructor(private readonly configService: ConfigService) {
    super();
  }

  canActivate(
    context: ExecutionContext,
  ): boolean | Promise<boolean> | Observable<boolean> {
    const req = context.switchToHttp().getRequest();
    // bypass for testing purposes
    const code: string | null = req.query['code'];
    const id: string | null = req.query['id'];
    if (
      id &&
      code &&
      code === this.configService.get<string>('FOR_REAL_NO_BYPASS')
    ) {
      req.user = mockUser1;
      req.user.id = +mockUser1.id;
      req.user.username = 'DoKong_mock';
      return true;
    }
    // console.log('id: ', id);
    // console.log('code: ', code);
    // console.log('req: ', req);
    // console.log('context: ', context);
    console.log('now super.canActivate(context) should trigger');
    return super.canActivate(context);
  }
}