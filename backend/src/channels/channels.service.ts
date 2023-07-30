import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Socket } from 'socket.io';
import { User } from 'src/users/entities/user.entity';
import { UsersService } from 'src/users/users.service';
import { Repository } from 'typeorm';
import { Channel } from './entities/channel.entity';
import { ChannelType } from './entities/channel.entity';

@Injectable()
export class ChannelsService {
  constructor(
    @InjectRepository(Channel)
    private readonly channelRepository: Repository<Channel>,
    @InjectRepository(User) private readonly userRepository: Repository<User>,
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

  async getChannelById(id: string): Promise<Channel | undefined> {
    try {
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
        throw new NotFoundException('Channel not found');
      } else {
        return channel;
      }
    } catch (error) {
      console.log(error);
    }
  }

  async getChannelByName(name: string): Promise<Channel | undefined> {
    try {
      const channel = await this.channelRepository
        .createQueryBuilder('channel')
        .where('channel.name = :name', { name: name })
        .leftJoinAndSelect('channel.owner', 'owner')
        .leftJoinAndSelect('channel.users', 'users')
        .leftJoinAndSelect('channel.admins', 'admins')
        .leftJoinAndSelect('channel.mutedUsers', 'mutedUsers')
        .leftJoinAndSelect('channel.invitedUsers', 'invitedUsers')
        .leftJoinAndSelect('channel.bannedUsers', 'bannedUsers')
        .getOne();
      if (channel === null) {
        throw new NotFoundException('Channel not found');
      } else {
        return channel;
      }
    } catch (error) {
      console.log(error);
    }
  }

  async findVisibleChannelsWithoutUser(
    id: number,
  ): Promise<Channel[] | undefined> {
    try {
      const subQuery = this.channelRepository
        .createQueryBuilder('channel')
        .leftJoin('channel.users', 'user')
        .where('user.id = :id', { id })
        .select('channel.id');

      return await this.channelRepository
        .createQueryBuilder('channel')
        .leftJoinAndSelect('channel.users', 'users')
        .where(`channel.id NOT IN (${subQuery.getQuery()})`)
        .andWhere('channel.type IN (:...types)', {
          types: [ChannelType.public, ChannelType.protected],
        })
        .setParameters(subQuery.getParameters())
        .getMany();
    } catch (error) {
      console.log(error);
    }
  }

  async createChannel(client: Socket, channelname: string, owner: number) {
    console.log('got channel', channelname);
    const user = await this.userService.findOne(owner);
    if (!user) {
      console.log('cant find user', owner);
      return;
    }
    const channelTest = await this.getChannelByName(channelname);
    if (channelTest) {
      console.log('channel already exists');
      return;
    }

    const chanEntity = this.channelRepository.create({
      name: channelname,
      owner: user,
      type: ChannelType.public,
      users: [user],
      admins: [user],
      mutedUsers: [],
      invitedUsers: [],
      bannedUsers: [],
    });

    user.ownedChannels = user.ownedChannels
      ? [...user.ownedChannels, chanEntity]
      : [chanEntity];
    user.channelList = user.channelList
      ? [...user.channelList, chanEntity]
      : [chanEntity];
    user.adminInChannel = user.adminInChannel
      ? [...user.adminInChannel, chanEntity]
      : [chanEntity];

    await this.channelRepository.save(chanEntity);
    client.join(chanEntity.id); //Is the id set here?
  }

  async addUserToChannel(client: Socket, channelId: string, userid: number) {
    try {
      const channel = await this.channelRepository.findOneByOrFail({
        id: channelId,
      });
      const user = await this.userService.findOne(userid);
      if (!channel || !user) {
        throw new NotFoundException('Channel or User not found');
      }
      channel.users.push(user);
      await this.channelRepository.save(channel);
      // user.channelList.push(channel);
      // await this.userRepository.save(user);
      client.join(channelId);
      return;
    } catch (error) {
      console.log(error);
    }
  }

  async removeUserFromChannel(
    client: Socket,
    channelId: string,
    userid: number,
  ) {
    try {
      const channel = await this.channelRepository.findOneByOrFail({
        id: channelId,
      });
      const user = await this.userService.findOne(userid);
      if (!channel || !user) {
        throw new NotFoundException('Channel or User not found');
      }
      channel.users = channel.users.filter((user) => user.id !== userid);
      this.channelRepository.save(channel);
      user.channelList = user.channelList.filter(
        (channel) => channel.id !== channelId,
      );
      this.userRepository.save(user);
    } catch (error) {
      console.log(error);
    }
  }
}
