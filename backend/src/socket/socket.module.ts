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
import { MatchService } from 'src/game/match/match.service';
import { ChannelsService } from 'src/channels/channels.service';
import { Channel } from 'src/channels/entities/channel.entity';
import { JwtService } from '@nestjs/jwt';
import { SocketController } from './socket.controller';
import { ChannelMute } from 'src/channels/entities/channelMute.entity';
import { ChannelMuteService } from 'src/channels/channel-mute/channel-mute.service';
import { Match } from 'src/game/entitites/match.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([Message, User, Channel, ChannelMute, Match]),
    HttpModule,
    // GameModule,
  ],
  providers: [
    SocketGateway,
    UsersService,
    MatchService,
    GameService,
    MessagesService,
    ChannelsService,
    ChannelMuteService,
    JwtService,
  ],
  exports: [SocketGateway],
  controllers: [SocketController],
})
export class SocketModule {
  constructor(private readonly socketGateway: SocketGateway) {}
}
