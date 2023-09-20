import { Controller, Get, Param, UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from 'src/auth/guard/jwt.guard';
import { CurrentJwtPayload } from 'src/users/decorator/current-jwt-payload.decorator';
import { UsersService } from 'src/users/users.service';
import { JwtPayload } from '../auth/strategy/jwt.strategy';
import { SocketGateway } from './socket.gateway';
import { User } from 'src/users/entities/user.entity';

@Controller('socket')
export class SocketController {
  constructor(
    private readonly usersService: UsersService,
    private readonly socketGateway: SocketGateway,
  ) {}

  @Get('verify/:socketId')
  @UseGuards(JwtAuthGuard)
  async verifySocket(
    @Param('socketId') socketId: string,
    @CurrentJwtPayload() jwtPayload: JwtPayload,
  ): Promise<{ verified: boolean }> {
    console.log(
      'verifySocket called with socketId:',
      socketId,
      'and user id:',
      jwtPayload.id,
    );

    let user: User = await this.usersService.findOne(jwtPayload.id);
    console.log(
      'The socketID of the user BEFORE changing is :  ',
      user.socketid,
    );

	if (user.socketid !== '' && socketId != user.socketid && user.socketid !== 'undefined') {
		setTimeout(async () => {
			if (this.socketGateway.server.sockets.sockets.has(user.socketid) === false) {
				await this.usersService.updateSocketid(jwtPayload.id, socketId);
				this.socketGateway.updateStatusAndEmit(jwtPayload.id, 'online');
			}
			else {
				console.log('The user is already connected. The new connection will be closed');
				this.socketGateway.handleAlreadyConnected(socketId);
			}
		}, 200);
	}
	else {
		await this.usersService.updateSocketid(jwtPayload.id, socketId);
		this.socketGateway.updateStatusAndEmit(jwtPayload.id, 'online');
	}

	// if (user.socketid !== '' && socketId != user.socketid && user.socketid !== 'undefined') {
	// 	console.log('The user is already connected. The new connection will be closed');
	// 	this.socketGateway.handleAlreadyConnected(socketId);
	// }
	// else {
	// 	await this.usersService.updateSocketid(jwtPayload.id, socketId);
	// 	this.socketGateway.updateStatusAndEmit(jwtPayload.id, 'online');
	// }

	// next 2 lines only for for development
	// await this.usersService.updateSocketid(jwtPayload.id, socketId);
	// this.socketGateway.updateStatusAndEmit(jwtPayload.id, 'online');


	user = await this.usersService.findOne(jwtPayload.id);
	console.log("The socketID of the user AFTER changing is :  ", user.socketid);

	return { verified: true };
  }
}
