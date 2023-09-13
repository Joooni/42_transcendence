import { HttpModule } from '@nestjs/axios';
import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PasswordService } from 'src/password/password.service';
import { User } from 'src/users/entities/user.entity';
import { UsersResolver } from 'src/users/users.resolver';
import { UsersService } from 'src/users/users.service';
import { ChannelsResolver } from './channels.resolver';
import { ChannelsService } from './channels.service';
import { Channel } from './entities/channel.entity';
import { ChannelMute } from './entities/channelMute.entity';
import { ChannelMuteModule } from './channel-mute/channel-mute.module';

@Module({
  providers: [
    ChannelsService,
    ChannelsResolver,
    UsersService,
    UsersResolver,
    PasswordService,
  ],
  imports: [
    TypeOrmModule.forFeature([Channel, User, ChannelMute]),
    ConfigModule,
    HttpModule,
    ChannelMuteModule,
  ],
  exports: [ChannelsService],
})
export class ChannelsModule {
  constructor(private channelsService: ChannelsService) {}
}
