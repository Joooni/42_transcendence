import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Server } from 'socket.io';
import { UsersService } from 'src/users/users.service';
import { Repository } from 'typeorm';
import { ChannelsService } from '../channels.service';
import { ChannelMute } from '../entities/channelMute.entity';
import { Job, scheduleJob } from 'node-schedule';
import { User } from 'src/users/entities/user.entity';
import { Channel } from '../entities/channel.entity';
import { SocketGateway } from 'src/socket/socket.gateway';
import { WebSocketGateway, WebSocketServer } from '@nestjs/websockets';

@Injectable()
@WebSocketGateway({ cors: ['http://localhost:80', 'http://localhost:3000'] })
export class ChannelMuteService {
  private mutedUsers: ChannelMute[] = [];
  private jobMap = new Map<number, Job>();

  @WebSocketServer()
  server: Server;

  constructor(
    @InjectRepository(ChannelMute)
    private readonly channelMuteRepository: Repository<ChannelMute>,
    private readonly usersService: UsersService,
    private readonly channelService: ChannelsService,
  ) {
    this.atStart();
  }

  async atStart() {
    this.mutedUsers = await this.findAll();
    this.jobMap.clear();
    this.mutedUsers.forEach(async (channelMute) => {
      if (channelMute.mutedUntil < new Date()) {
        await this.channelMuteRepository.delete(channelMute.id);
      } else {
        this.scheduleUnmute(
          channelMute.id,
          channelMute.channel,
          channelMute.user,
          channelMute.mutedUntil,
        );
      }
    });
    this.mutedUsers = await this.findAll();
  }

  async findAll(): Promise<ChannelMute[]> {
    return this.channelMuteRepository
      .createQueryBuilder('channelMute')
      .leftJoinAndSelect('channelMute.user', 'user')
      .leftJoinAndSelect('channelMute.channel', 'channel')
      .getMany();
  }

  async addToDB(channelid: string, userid: number, mutedUntil: Date) {
    try {
      const user = await this.usersService.findOne(userid);
      const channel = await this.channelService.getChannelById(channelid);
      if (!user || !channel) {
        throw new Error(
          'User or channel not found while creating ChannelMute entity',
        );
      }
      const channelMute = this.channelMuteRepository.create({
        channel: channel,
        user: user,
        mutedUntil: mutedUntil,
      });
      await this.channelMuteRepository.save(channelMute);
    } catch (error) {
      console.log(error);
    }
  }

  async muteUser(
    activeUserId: number,
    selectedUserId: number,
    channelId: string,
    time: number,
  ) {
    try {
      const channel = await this.channelService.getChannelById(channelId);
      const selectedUser = await this.usersService.findOne(selectedUserId);
      const activeUser = await this.usersService.findOne(activeUserId);
      if (!channel || !selectedUser || !activeUser) {
        throw new NotFoundException('Channel or Users not found');
      }

      if (
        channel.admins.find((user) => user.id == activeUser.id) == undefined &&
        channel.owner.id != activeUser.id
      ) {
        throw new Error('User is not admin');
      }
      if (
        channel.admins.find((user) => user.id == selectedUser.id) !=
          undefined &&
        channel.owner.id != activeUser.id
      ) {
        throw new Error('Selected User is admin');
      }

      this.mutedUsers.find((mutedUser) => {
        if (
          mutedUser.user.id == selectedUser.id &&
          mutedUser.channel.id == channel.id
        ) {
          throw new Error('User is already muted');
        }
      });
      const current = new Date();
      current.setMinutes(current.getMinutes() + time);
      await this.addToDB(channel.id, selectedUser.id, current);

      this.mutedUsers = await this.findAll();
      const mUser = this.mutedUsers.find((mutedUser) => {
        if (
          mutedUser.user.id == selectedUser.id &&
          mutedUser.channel.id == channel.id
        )
          return mutedUser;
      });
      if (!mUser) throw new Error('Created Muted User not found');
      this.scheduleUnmute(mUser.id, channel, selectedUser, current);
      this.server.to(channelId).emit('updateChannel', {});
    } catch (error) {
      console.log(error);
    }
  }

  async unmuteUser(user: User, channel: Channel, id?: number) {
    try {
      await this.channelMuteRepository
        .createQueryBuilder()
        .delete()
        .where('channel = :channelId', { channelId: channel.id })
        .andWhere('user = :userId', { userId: user.id })
        .execute();
      if (!id) {
        //Unmuted by admin
        const mUser = this.mutedUsers.find((mutedUser) => {
          if (
            mutedUser.user.id == user.id &&
            mutedUser.channel.id == channel.id
          )
            return mutedUser;
        });
        if (!mUser) {
          throw new Error('Muted User not found');
        }
        id = mUser.id;
        const job = this.jobMap.get(id);
        if (job) {
          console.log('schedule job ' + id + ' cancelled');
          job.cancel();
        }
      }
      this.jobMap.delete(id);
      this.mutedUsers = await this.findAll();
      // server.to(channel.id).emit('updateChannel', {});
      this.server.to(channel.id).emit('updateChannel', {});
    } catch (error) {
      console.log(error);
    }
  }

  async isMuted(channelId: string, userId: number): Promise<boolean> {
    const user = this.mutedUsers.find((mutedUser) => {
      if (mutedUser.user.id == userId && mutedUser.channel.id == channelId) {
        return mutedUser;
      }
    });
    if (user) {
      return true;
    }
    return false;
  }

  scheduleUnmute(id: number, channel: Channel, user: User, date: Date) {
    const job = scheduleJob(date, () => {
      console.log('scheduled Task unmute called');
      this.unmuteUser(user, channel, id);
    });
    this.jobMap.set(id, job);
  }
}
