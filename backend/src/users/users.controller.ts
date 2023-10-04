import {
  Controller,
  Post,
  UseGuards,
  UseInterceptors,
  ParseFilePipe,
  FileTypeValidator,
  UploadedFile,
  MaxFileSizeValidator,
} from '@nestjs/common';
import { UsersService } from './users.service';
import { ConfigService } from '@nestjs/config';
import { JwtAuthGuard } from 'src/auth/guard/jwt.guard';
import { TwoFAGuard } from 'src/auth/guard/twoFA.guard';
import { FileInterceptor } from '@nestjs/platform-express';
import { v4 as uuidv4 } from 'uuid';
import * as path from 'path';
import { CurrentJwtPayload } from './decorator/current-jwt-payload.decorator';
import { JwtPayload } from 'src/auth/strategy/jwt.strategy';
import { Express } from 'express';
import { diskStorage } from 'multer';

@Controller('users')
@UseGuards(JwtAuthGuard, TwoFAGuard)
export class UsersController {
  constructor(
    private readonly usersService: UsersService,
    private readonly configService: ConfigService,
  ) {}

  /*
	The FileInterceptor() decorator takes two arguments:

    fieldName: string that supplies the name of the field from the HTML form that holds a file
    options: optional object of type MulterOptions. This is the same object used by the multer constructor
	-> I have used dest, but storage could give us more control about how and where data gets stored. Do we need that?
	-> could have some conflicts when two people upload image with the same name?
	*/
  @Post('upload/:id')
  @UseInterceptors(
    FileInterceptor('picture', {
      storage: diskStorage({
        destination: './uploads/profile_pictures',
        filename: (req, file, cb) => {
          const filename: string = req.params.id + '_pfp_' + uuidv4();
          const extension: string = path.parse(file.originalname).ext;

          cb(null, `${filename}${extension}`);
        },
      }),
    }),
  )
  async uploadFile(
    @UploadedFile(
      new ParseFilePipe({
        validators: [
          new FileTypeValidator({ fileType: '(jpeg|jpg|png|gif)$' }),
          new MaxFileSizeValidator({ maxSize: 5242880 }),
        ],
      }),
    )
    file: Express.Multer.File,
    @CurrentJwtPayload()
    payload: JwtPayload,
  ) {
    const uploadedPictureUrl = `http://${this.configService.get(
      'DOMAIN',
    )}:3000/${file.path}`;
    console.log('uploaded picture url: ', uploadedPictureUrl);
    await this.usersService.updatePicture(payload.id, uploadedPictureUrl);
    return { url: uploadedPictureUrl };
  }
}
