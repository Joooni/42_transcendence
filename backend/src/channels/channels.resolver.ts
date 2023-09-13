import { UseGuards } from '@nestjs/common';
import { Resolver, Query, Args, Int } from '@nestjs/graphql';
import { JwtAuthGuard } from 'src/auth/guard/jwt.guard';
import { ChannelMuteService } from './channel-mute/channel-mute.service';
import { ChannelsService } from './channels.service';
import { Channel } from './entities/channel.entity';
import { ChannelMute } from './entities/channelMute.entity';

@Resolver('Channel')
@UseGuards(JwtAuthGuard)
export class ChannelsResolver {
  constructor(
    private readonly channelsService: ChannelsService,
    private readonly channelMuteService: ChannelMuteService,
    ) {}

  @Query(() => [Channel], { name: 'channels' })
  async findAll(): Promise<Channel[]> {
    return this.channelsService.findAll();
  }

  @Query(() => Channel, { name: 'channel' })
  async findOne(
    @Args('id', { type: () => String, nullable: true }) id: string,
  ) {
    return this.channelsService.getChannelById(id);
  }

  @Query(() => Channel, { name: 'channelByName' })
  async findOneByName(
    @Args('name', { type: () => String, nullable: true }) name: string,
  ) {
    return this.channelsService.getChannelByName(name);
  }

  @Query(() => [Channel], { name: 'visibleChannelsWithoutUser' })
  async findVisibleChannelsWithoutUser(
    @Args('id', { type: () => Int, nullable: true }) id: number,
  ) {
    return this.channelsService.findVisibleChannelsWithoutUser(id);
  }

  @Query(() => [ChannelMute], { name: 'channelMutes' })
  async findAllChannelMutes(): Promise<ChannelMute[]> {
    return this.channelMuteService.findAll();
  }
}
