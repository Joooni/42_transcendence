import { UseGuards } from '@nestjs/common';
import { Resolver, Query } from '@nestjs/graphql';
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
}
