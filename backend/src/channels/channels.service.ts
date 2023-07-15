import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Socket } from 'socket.io';
import { UsersService } from 'src/users/users.service';
import { EntityNotFoundError, Repository } from 'typeorm';
import { CreateChannelInput } from './dto/create-channel.input';
import { Channel } from './entities/channel.entity';
import { ChannelType } from './entities/channel.entity';

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

	async getChannelById(id: string): Promise<Channel> {
		const channel = await this.channelRepository
		.createQueryBuilder('channel')
		.where('channel.id = :id', { id: id })
		.leftJoinAndSelect('channel.owner', 'owner')
		.leftJoinAndSelect('channel.users', 'users')
		.leftJoinAndSelect('channel.admins', 'admins')
		.leftJoinAndSelect('channel.mutedUsers', 'mutedUsers')
		.leftJoinAndSelect('channel.invitedUsers', 'invitedUsers')
		.leftJoinAndSelect('channel.bannedUsers', 'bannedUsers')
		.getOne();
		if (channel === null) {
			throw new EntityNotFoundError(Channel, {});
		} else {
			return channel;
		}
	}

	async createChannel(client: Socket, channelname: string, owner: number) {
		console.log('got channel', channelname);
		const user = await this.userService.findOne(owner);
		if (!user) {
			console.log('cant find user', owner);
			return;
		}
		const chanEntity = this.channelRepository.create({
			name: channelname,
			owner: user,
			type: ChannelType.public,
			users: [user],
			admins: [],
			mutedUsers: [],
			invitedUsers: [],
			bannedUsers: [],
		});
		await this.channelRepository.save(chanEntity);
	}
}
