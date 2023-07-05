import { Module } from '@nestjs/common';
import { SocketGateway } from './socket.gateway';
// import { GameModule } from '../game/game.module';
// import { GameService } from 'src/game/game.service';
import { MatchModule } from 'src/game/match/match.module';
import { MatchService } from 'src/game/match/match.service';

@Module({
	// imports: [GameModule],
	imports: [MatchModule],
	providers: [SocketGateway],
	// exports: [SocketGateway]
})


export class SocketModule {

	constructor(private matchService: MatchService) {}

}
