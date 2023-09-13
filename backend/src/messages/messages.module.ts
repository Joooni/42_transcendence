import { HttpModule } from '@nestjs/axios';
import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Message } from './entities/message.entity';
import { MessagesService } from './messages.service';
import { MessagesResolver } from './messages.resolver';
import { User } from 'src/users/entities/user.entity';
import { UsersService } from 'src/users/users.service';
import { UsersResolver } from 'src/users/users.resolver';
import { Channel } from 'src/channels/entities/channel.entity';
import { ChannelsService } from 'src/channels/channels.service';
import { ChannelsResolver } from 'src/channels/channels.resolver';
import { ChannelMute } from 'src/channels/entities/channelMute.entity';
import { ChannelMuteService } from 'src/channels/channel-mute/channel-mute.service';

@Module({
  providers: [
    MessagesService,
    MessagesResolver,
    UsersService,
    UsersResolver,
    ChannelsService,
    ChannelsResolver,
    ChannelMuteService,
  ],
  imports: [
    TypeOrmModule.forFeature([Message, User, Channel, ChannelMute]),
    ConfigModule,
    HttpModule,
  ],
  exports: [MessagesService],
})
export class MessagesModule {
  constructor(private messagesService: MessagesService) {}
}
