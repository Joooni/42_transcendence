
import { Body, Controller, Post, HttpCode, HttpStatus, Get, Req, Res, BadRequestException, UseGuards } from '@nestjs/common';
import { AuthService } from '../service/auth.service';
import { Response } from 'express';
import { CreateUserInput } from 'src/users/dto/create-user.input';
import { AuthGuard } from '@nestjs/passport';
@Controller('42intra')
export class AuthController {
	constructor(private authService: AuthService) {}

	@HttpCode(HttpStatus.OK)
	// ideally, instead of Record, use a DTO class to define request body shape
	@Get('login')
	async intra_login(@Req() req: any, @Res() res: any): Promise<any> {
		console.log("inside auth controller/login");
		await this.authService.login(req, res);
	}

	@Get('callback')
	async callback(@Req() req: any, @Res({ passthrough: true }) res: Response) {
		if (typeof req.user == 'undefined')
			throw new BadRequestException("Verification with 42Intra failed");
	}

	@Get('test')
	testfunc(): string {
		return "this is a teststring";
	}

	@Get()
	headempty(): string {
		return "this is just /42intra, bruh";
	}
}
