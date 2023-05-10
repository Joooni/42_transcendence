
import { Body, Controller, Post, HttpCode, HttpStatus, Get, Req, Res, BadRequestException, UseGuards } from '@nestjs/common';
import { AuthService } from '../service/auth.service';
import { Response } from 'express';
import { CreateUserInput } from 'src/users/dto/create-user.input';
import { AuthGuard } from '@nestjs/passport';
import { User } from '../../users/entities/user.entity';
import { Intra42OAuthGuard } from '../guard/auth.guard';
import { UsersService } from '../../users/users.service';
import { EntityNotFoundError } from 'typeorm';
@Controller('42intra')
export class Intra42Controller {
	constructor(
		private readonly usersService: UsersService
		) {}

	@HttpCode(HttpStatus.OK)
	// ideally, instead of Record, use a DTO class to define request body shape
	@Get('login')
	@UseGuards(Intra42OAuthGuard)
	login(): void {
		console.log("login here");
		return;
	}
	// async intra_login(@Req() req: any, @Res() res: any): Promise<any> {
	// 	console.log("inside auth controller/login");
	// 	await this.authService.login(req, res);
	// }

	@Get('callback')
	@UseGuards(Intra42OAuthGuard)
	async callback(@Req() req: any, @Res({ passthrough: true }) res: Response) {
		if (typeof req.user == 'undefined')
			throw new BadRequestException("Verification with 42Intra failed");

		let user: User | CreateUserInput = req.user;
		try {
			user = await this.usersService.findOne(+user.id);
		} catch (error) {
			if (error instanceof EntityNotFoundError) {
				await this.usersService.create(user);
			}
			else {
				throw error;
			}
		}
	}

	@Get('logout')
	logout(@Res({ passthrough: true }) res: Response): void {
		console.log('logout route');
	}

	@Get()
	headempty(): string {
		return "this is just /42intra, bruh!";
	}
}
