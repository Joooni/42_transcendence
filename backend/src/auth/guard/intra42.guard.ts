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
    // bypass for testing purposes, should be removed before eval
    const code: string | null = req.query['code'];
    const id = req.query['id'] as string | undefined;
    if (
      id &&
      code &&
      code === this.configService.get<string>('FOR_REAL_NO_BYPASS')
    ) {
      req.user = mockUser1;
      req.user.id = +id;
      req.user.username = `Kong_${id}`;
      req.user.picture =
        'https://mario.wiki.gallery/images/8/84/MPS_Donkey_Kong_Artwork.png';
      return true;
    }
    return super.canActivate(context);
  }
}
