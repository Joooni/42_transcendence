import { Controller, MaxFileSizeValidator, Post, UseGuards, UseInterceptors, ParseFilePipe, FileTypeValidator, UploadedFile } from '@nestjs/common';
import { UsersService } from './users.service';
import { ConfigService } from '@nestjs/config';
import { JwtAuthGuard } from 'src/auth/guard/jwt.guard';
import { TwoFAGuard } from 'src/auth/guard/twoFA.guard';
import { FileInterceptor } from '@nestjs/platform-express';
import { CurrentJwtPayload } from './decorator/current-jwt-payload.decorator';
import { JwtPayload } from 'src/auth/strategy/jwt.strategy';

@Controller('users')
@UseGuards(JwtAuthGuard, TwoFAGuard)
export class UsersController {

	constructor(
		private readonly usersService: UsersService,
		private readonly configService: ConfigService
	) {}

	/*
	The FileInterceptor() decorator takes two arguments:

    fieldName: string that supplies the name of the field from the HTML form that holds a file
    options: optional object of type MulterOptions. This is the same object used by the multer constructor
	-> I have used dest, but storage could give us more control about how and where data gets stored. Do we need that?
	-> could have some conflicts when two people upload image with the same name?
	*/
	@Post('upload')
	@UseInterceptors(FileInterceptor('picture', {dest: 'uploads/profile_pictures/'}))
	async uploadFile(
		@UploadedFile(
		new ParseFilePipe({
			validators: [
				new FileTypeValidator({ fileType: '(jpeg|jpg|png)$'}),
				// we can validate file size here too - do we want that?
			],
		}),
		)
		file: Express.Multer.File,
		@CurrentJwtPayload()
		payload: JwtPayload,
	) {
		const uploadedPictureUrl = `http://${this.configService.get('DOMAIN')}:3000/${file.path}`;
		await this.usersService.updatePicture(payload.id, uploadedPictureUrl);
		// do we need to return anything here?
	}
}
