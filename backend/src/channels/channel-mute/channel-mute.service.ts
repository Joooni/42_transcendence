import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Server } from 'socket.io';
import { UsersService } from 'src/users/users.service';
import { Repository } from 'typeorm';
import { ChannelsService } from '../channels.service';
import { ChannelMute } from '../entities/channelMute.entity';

@Injectable()
export class ChannelMuteService {
	constructor(
		@InjectRepository(ChannelMute)
		private readonly channelMuteRepository: Repository<ChannelMute>,
		private readonly usersService: UsersService,
		private readonly channelService: ChannelsService,
	) {}

	async findAll(): Promise<ChannelMute[]> {
		return this.channelMuteRepository
		.createQueryBuilder('channelMute')
		.leftJoinAndSelect('channelMute.user', 'user')
		.leftJoinAndSelect('channelMute.channel', 'channel')
		.getMany();
	}

	async create(channelid: string, userid: number, mutedUntil: Date) {
		try {
			const user = await this.usersService.findOne(userid);
			const channel = await this.channelService.getChannelById(channelid);
			if (!user || !channel) {
				throw new Error('User or channel not found while creating ChannelMute entity');
			}
			const channelMute = this.channelMuteRepository.create({
				channel: channel,
				user: user,
				mutedUntil: mutedUntil,
			});
			this.channelMuteRepository.save(channelMute);
		} catch(error) {
			console.log(error);
		}
	}

	async muteUser(server: Server, activeUserId: number, selectedUserId: number, channelId: string, time: number) {
		try {
		  const channel = await this.channelService.getChannelById(channelId);
		  const selectedUser = await this.usersService.findOne(selectedUserId);
		  const activeUser = await this.usersService.findOne(activeUserId);
		  if (!channel || !selectedUser || !activeUser) {
			throw new NotFoundException('Channel or Users not found');
		  }
	
		  if (channel.admins.find(user => user.id === activeUser.id) == undefined && channel.owner.id !== activeUser.id) {
			throw new Error('User is not admin');
		  }
		  if (channel.admins.find(user => user.id === selectedUser.id) != undefined && channel.owner.id !== activeUser.id) {
			throw new Error('Selected User is admin');
		  }
	
		  //Mute den User
		  const current = new Date();
		  current.setMinutes(current.getMinutes() + time);
		  console.log(current);
		  await this.create(channel.id, selectedUser.id, current);
	
		  // channel.mutedUsers.push(selectedUser);
		  // await this.channelRepository.save(channel);
		  // server.to(channelId).emit('updateChannel', {});
		  // server.to(selectedUser.socketid).emit('updateChannel', {});
		  // setTimeout(() => {
		  //   this.unmuteUser(server, activeUserId, selectedUserId, channelId);
		  // }, time);
	
		} catch (error) {
		  console.log(error);
		}
	  }
}
