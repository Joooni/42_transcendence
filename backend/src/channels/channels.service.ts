import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { UsersService } from 'src/users/users.service';
import { Repository } from 'typeorm';
import { Channel } from './entities/channel.entity';

@Injectable()
export class ChannelsService {
	constructor(
		@InjectRepository(Channel) private readonly channelRepository: Repository<Channel>,
		private readonly userService: UsersService,
	) {}

	async findAll(): Promise<Channel[]> {
		console.log('This action returns all channels');
		const channels = await this.channelRepository
			.createQueryBuilder('channel')
			.leftJoinAndSelect('channel.owner', 'owner')
			.leftJoinAndSelect('channel.users', 'users')
			.leftJoinAndSelect('channel.admins', 'admins')
			.leftJoinAndSelect('channel.mutedUsers', 'mutedUsers')
			.leftJoinAndSelect('channel.invitedUsers', 'invitedUsers')
			.leftJoinAndSelect('channel.bannedUsers', 'bannedUsers')
			.getMany();
		return channels;
	}
}
