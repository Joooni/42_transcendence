import { Module } from '@nestjs/common';
import { SocketGateway } from './socket.gateway';
import { GameModule } from '../game/game.module';
import { GameService } from 'src/game/game.service';

@Module({
	imports: [GameModule],
	providers: [SocketGateway],
	// exports: [SocketGateway]
})


export class SocketModule {

	constructor(private gameService: GameService) {}

}
