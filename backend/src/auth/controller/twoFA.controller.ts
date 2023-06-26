import {
  BadRequestException,
  Controller,
  Req,
  UseGuards,
  Get,
  Res,
  Query,
} from '@nestjs/common';
import { JwtAuthGuard } from '../guard/jwt.guard';
import { JwtService } from '@nestjs/jwt';
import { TwoFAService } from '../service/twoFA.service';
import { UsersService } from '../../users/users.service';
import { User } from 'src/users/entities/user.entity';
import { JwtPayload } from '../strategy/jwt.strategy';
import { TwoFAGuard } from '../guard/twoFA.guard';

@Controller('2fa')
export class TwoFAController {
  constructor(
    private readonly twoFAService: TwoFAService,
    private readonly jwtService: JwtService,
    private readonly usersService: UsersService,
  ) {}

  @Get('generate')
  @UseGuards(JwtAuthGuard, TwoFAGuard)
  async generate(@Req() req: any): Promise<string> {
    try {
      const user: User = await this.usersService.findOne(req.user.id);
      const { otpAuthUrl } = await this.twoFAService.generate2FASecret(user);
      // learn how to make QR code and/or secret passphrase for authenticator app here
      // put DataURI/Filestream in response to get to frontend?
      console.log(
        'QRcode URI: ',
        this.twoFAService.generateQRCodeDataURL(otpAuthUrl),
      );
      return this.twoFAService.generateQRCodeDataURL(otpAuthUrl);
    } catch (error) {
      throw new BadRequestException(error.message);
    }
  }

  @Get('verify')
  @UseGuards(JwtAuthGuard)
  async verify(
    @Req() req: any,
    @Res() res: Response,
    @Query('code') code: string | null,
  ) {
    if (req.user.isAuthenticated)
      throw new BadRequestException('User is already authenticated');
    if (!code) throw new BadRequestException('2FA code missing');
    try {
      const user: User = await this.usersService.findOne(req.user.id);
      return await this.twoFAService.verify2FA(user, code).then(() => {
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        const jwt_token = this.jwtService.sign({
          id: req.user.id,
          email: req.user.email,
          isAuthenticated: true,
        } as JwtPayload);
      });
    } catch (error) {
      throw new BadRequestException(error.message);
    }
  }

  @Get('enable')
  @UseGuards(JwtAuthGuard, TwoFAGuard)
  async enableTwoFA(
    @Req() req: any,
    @Query('code') code: string | null,
  ): Promise<void> {
    if (!code) throw new BadRequestException('2FA code missing');
    try {
      const user: User = await this.usersService.findOne(req.user.id);
      await this.twoFAService.enable2FA(user, code);
    } catch (error) {
      throw new BadRequestException(error.message);
    }
  }

  @Get('disable')
  @UseGuards(JwtAuthGuard, TwoFAGuard)
  async disableTwoFA(@Req() req: any): Promise<void> {
    try {
      const user: User = await this.usersService.findOne(req.user.id);
      await this.twoFAService.disable2FA(user);
    } catch (error) {
      throw new BadRequestException(error.message);
    }
  }
}
