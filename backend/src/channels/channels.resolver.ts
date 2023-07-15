import { UseGuards } from '@nestjs/common';
import { Resolver, Query, Args } from '@nestjs/graphql';
import { JwtAuthGuard } from 'src/auth/guard/jwt.guard';
import { ChannelsService } from './channels.service';
import { Channel } from './entities/channel.entity';

@Resolver('Channel')
@UseGuards(JwtAuthGuard)
export class ChannelsResolver {
	constructor(private readonly channelsService: ChannelsService) {}

	@Query(() => [Channel], { name: 'channels' })
	async findAll(): Promise<Channel[]> {
		return this.channelsService.findAll();
	}

	@Query(() => Channel, { name: 'channel' })
	async findOne(
		@Args('id', { type: () => String, nullable: false }) id: string,
		) {
		return this.channelsService.getChannelById(id);
	}
}
