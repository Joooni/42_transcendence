
import { Body, Controller, Post, HttpCode, HttpStatus, Get, Req, Res } from '@nestjs/common';
import { AuthService } from '../service/auth.service';

@Controller('42intra')
export class AuthController {
	constructor(private authService: AuthService) {}

	@HttpCode(HttpStatus.OK)
	// ideally, instead of Record, use a DTO class to define request body shape
	@Get('login')
	async intra_login(@Req() req: any, @Res() res: any): Promise<any> {
		await this.authService.login(req, res);
	}

}
