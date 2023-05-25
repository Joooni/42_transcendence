import { Injectable } from '@nestjs/common';
import { authenticator } from 'otplib';
import { User } from 'src/users/entities/user.entity';
import { UsersService } from 'src/users/users.service';
import { toDataURL } from 'qrcode';
@Injectable()
export class TwoFAService {
  constructor(private readonly userService: UsersService) {}

  async generate2FASecret(user: User) {
    const secret = authenticator.generateSecret();

    const otpAuthUrl = authenticator.keyuri(user.email, 'Donkey Pong', secret);

    await this.userService.updateTwoFASecret(secret, user.id);

    return {
      secret,
      otpAuthUrl,
    };
  }

  async verify2FA(user: User, code: string): Promise<void> {
    if (!user.twoFAEnabled) return;

    if (!user.twoFAsecret)
      throw new Error('Fatal: 2FA is enabled, but empty 2FA Secret');

    if (!authenticator.verify({ token: code, secret: user.twoFAsecret }))
      throw new Error('2FA Code invald');
  }

  async enable2FA(user: User, code: string) {
    if (user.twoFAEnabled) throw new Error('2FA is already enabled');
    if (!user.twoFAsecret) throw new Error('Pending 2FA with empty 2FA Secret');
    if (!authenticator.verify({ token: code, secret: user.twoFAsecret }))
      throw new Error('2FA Code invalid');

    await this.userService.update2FAEnable(user.id, true);
  }

  async disable2FA(user: User) {
    if (!user.twoFAEnabled) throw new Error('2FA is already disabled');

    await this.userService.update2FAEnable(user.id, false);
  }

  async generateQRCodeDataURL(otpAuthUrl: string): Promise<any> {
    return toDataURL(otpAuthUrl);
  }
}
