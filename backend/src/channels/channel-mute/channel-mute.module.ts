import { HttpModule } from '@nestjs/axios';
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Message } from 'src/messages/entities/message.entity';
import { PasswordService } from 'src/password/password.service';
import { SocketGateway } from 'src/socket/socket.gateway';
import { SocketModule } from 'src/socket/socket.module';
import { User } from 'src/users/entities/user.entity';
import { UsersResolver } from 'src/users/users.resolver';
import { UsersService } from 'src/users/users.service';
import { ChannelsResolver } from '../channels.resolver';
import { ChannelsService } from '../channels.service';
import { Channel } from '../entities/channel.entity';
import { ChannelMute } from '../entities/channelMute.entity';
import { ChannelMuteService } from './channel-mute.service';

@Module({
  providers: [
    ChannelMuteService,
    UsersService,
    UsersResolver,
    ChannelsService,
    ChannelsResolver,
    PasswordService,
  ],
  imports: [
    TypeOrmModule.forFeature([ChannelMute, User, Channel, Message]),
    HttpModule,
  ],
  exports: [ChannelMuteService],
})
export class ChannelMuteModule {}
