import { HttpModule } from '@nestjs/axios';
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Message } from 'src/messages/entities/message.entity';
import { MessagesService } from 'src/messages/messages.service';
import { User } from 'src/users/entities/user.entity';
import { UsersService } from 'src/users/users.service';
import { SocketGateway } from './socket.gateway';
import { GameModule } from '../game/game.module';
import { GameService } from 'src/game/game.service';
import { MatchModule } from 'src/game/match/match.module';
import { MatchService } from 'src/game/match/match.service';
import { ChannelsService } from 'src/channels/channels.service';
import { Channel } from 'src/channels/entities/channel.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([Message, User, Channel]),
    HttpModule,
    MatchModule,
    GameModule,
  ],
  providers: [
    SocketGateway,
    UsersService,
    MatchService,
    MessagesService,
    ChannelsService,
  ],
  exports: [SocketGateway],
})
export class SocketModule {
  constructor(
    private matchService: MatchService,
    private gameService: GameService,
  ) {}
}
