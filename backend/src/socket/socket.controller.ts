import { Controller, Get, Param, UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from 'src/auth/guard/jwt.guard';
import { CurrentJwtPayload } from 'src/users/decorator/current-jwt-payload.decorator';
import { UsersService } from 'src/users/users.service';
import { JwtPayload } from '../auth/strategy/jwt.strategy';
import { SocketGateway } from './socket.gateway';

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
		
		
		console.log('verifySocket called with socketId:', socketId,
		'and user id:', jwtPayload.id);

		await this.usersService.updateSocketid(jwtPayload.id, socketId);
		this.socketGateway.updateStatusAndEmit(jwtPayload.id, 'online');
		return { verified: true };
	}
}
