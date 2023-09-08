import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { WebSocketServer } from '@nestjs/websockets';
import { Server } from 'socket.io';
import { UsersService } from 'src/users/users.service';
import { Repository } from 'typeorm';
import { ChannelsService } from '../channels.service';
import { ChannelMute } from '../entities/channelMute.entity';

@Injectable()
export class ChannelMuteService {
	private mutedUsers: ChannelMute[] = [];
	constructor(
		@InjectRepository(ChannelMute)
		private readonly channelMuteRepository: Repository<ChannelMute>,
		private readonly usersService: UsersService,
		private readonly channelService: ChannelsService,
	) {
		this.atStart();
	}

	@WebSocketServer()
	server: Server;

	async atStart() {
		this.mutedUsers = await this.findAll();
	}

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

		  const foundMutedUser = this.mutedUsers.find(mutedUser => {
			if (mutedUser.user.id === selectedUser.id && mutedUser.channel.id === channel.id) {
			  return mutedUser;
			}
		  });
		  const current = new Date();
		  current.setMinutes(current.getMinutes() + time);
		  if (foundMutedUser) {
			foundMutedUser.mutedUntil = current;
			await this.channelMuteRepository.save(foundMutedUser);
		  } else {
			await this.create(channel.id, selectedUser.id, current);
			
			this.mutedUsers = await this.findAll();
			// const mUserDB = await this.channelMuteRepository
			// .createQueryBuilder('channelMute')
			// .where('channelMute.channel = :channelId', { channelId: channel.id })
			// .andWhere('channelMute.user = :userId', { userId: selectedUser.id })
			// .leftJoinAndSelect('channelMute.user', 'user')
			// .leftJoinAndSelect('channelMute.channel', 'channel')
			// .getOne();
			// if (!mUserDB) {
			//   throw new Error('Muted User not found');
			// }
			// this.mutedUsers.push(mUserDB);
		  }
		 
		  console.log(this.mutedUsers);
		  server.to(channelId).emit('updateChannel', {});
	
		} catch (error) {
		  console.log(error);
		}
	}

	async unmuteUser(server: Server, activeUserId: number, selectedUserId: number, channelId: string) {
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

		await this.channelMuteRepository
		.createQueryBuilder()
		.delete()
		.where('channel = :channelId', { channelId: channelId })
		.andWhere('user = :userId', { userId: selectedUserId })
		.execute();
		this.mutedUsers = await this.findAll();
	}

	async isMuted(channelId: string, userId: number): Promise<boolean> {
		console.log(this.mutedUsers);
		const user = this.mutedUsers.find(mutedUser => {
			if (mutedUser.user.id === userId && mutedUser.channel.id === channelId) {
				return mutedUser;
			}
		});
		if (user) {
			console.log('user is in muted list');
			if (user.mutedUntil > new Date()) {
				console.log('user is muted until:' + user.mutedUntil);
				console.log('current time: ' + new Date());
				return true;
			}
			else {
				console.log('time is over, user will be removed from muted list');
				
				await this.channelMuteRepository
				.createQueryBuilder()
				.delete()
				.where('channel = :channelId', { channelId: channelId })
				.andWhere('user = :userId', { userId: userId })
				.execute();
				this.mutedUsers = await this.findAll();
				
				return false;
			}
		}
		return false;
	}
}
