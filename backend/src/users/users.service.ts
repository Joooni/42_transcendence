import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { CreateUserInput } from './dto/create-user.input';
import { ConfigService } from '@nestjs/config';
import { HttpService } from '@nestjs/axios';
import { User } from './entities/user.entity';
import {
  EntityNotFoundError,
  Like,
  QueryFailedError,
  Repository,
  UpdateResult,
} from 'typeorm';
import { mockUsers } from './entities/user.entity.mock';
import { Channel } from 'src/channels/entities/channel.entity';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User) private readonly userRepository: Repository<User>,
    @InjectRepository(Channel)
    private readonly channelRepository: Repository<Channel>,
    private readonly configService: ConfigService,
    private readonly httpService: HttpService,
  ) {}

  async create(createUserInput: CreateUserInput): Promise<void> {
    console.log('This action adds a new user');
    //repository.insert method is used to insert a new entity or an array of entities into the database.
    try {
      await this.userRepository.insert(createUserInput);
    } catch (error) {
      if (!(error instanceof QueryFailedError)) return Promise.reject(error);
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      const existingUsers: User[] = await this.userRepository.find({
        where: { username: Like(`${createUserInput.username}%`) },
      });
    }
    return Promise.resolve();
  }

  async findAll(): Promise<User[]> {
    //
    return await this.userRepository
      .createQueryBuilder('user')
      .leftJoinAndSelect('user.ownedChannels', 'ownedChannels')
      .leftJoinAndSelect('user.channelList', 'channelList')
      .leftJoinAndSelect('user.adminInChannel', 'adminInChannel')
      .leftJoinAndSelect('user.mutedInChannel', 'mutedInChannel')
      .leftJoinAndSelect('user.invitedInChannel', 'invitedInChannel')
      .getMany();
  }

  async findAllExceptMyself(excludedUserId: number): Promise<User[]> {
    //
    return await this.userRepository
      .createQueryBuilder('user')
      .where('user.id != :excludedUserId', { excludedUserId })
      .leftJoinAndSelect('user.ownedChannels', 'ownedChannels')
      .leftJoinAndSelect('user.channelList', 'channelList')
      .leftJoinAndSelect('user.adminInChannel', 'adminInChannel')
      .leftJoinAndSelect('user.mutedInChannel', 'mutedInChannel')
      .leftJoinAndSelect('user.invitedInChannel', 'invitedInChannel')
      .getMany();
  }

  async findOne(identifier: number | string): Promise<User> {
    if (typeof identifier === 'number') {
      return await this.userRepository
        .createQueryBuilder('user')
        .where({ id: identifier })
        .leftJoinAndSelect('user.ownedChannels', 'ownedChannels')
        .leftJoinAndSelect('user.channelList', 'channelList')
        .leftJoinAndSelect('user.adminInChannel', 'adminInChannel')
        .leftJoinAndSelect('user.mutedInChannel', 'mutedInChannel')
        .leftJoinAndSelect('user.invitedInChannel', 'invitedInChannel')
        .getOneOrFail();

      //old
      //return this.userRepository.findOneByOrFail({ id: identifier });
    } else if (typeof identifier === 'string') {
      return await this.userRepository
        .createQueryBuilder('user')
        .where({ username: identifier })
        .leftJoinAndSelect('user.ownedChannels', 'ownedChannels')
        .leftJoinAndSelect('user.channelList', 'channelList')
        .leftJoinAndSelect('user.adminInChannel', 'adminInChannel')
        .leftJoinAndSelect('user.mutedInChannel', 'mutedInChannel')
        .leftJoinAndSelect('user.invitedInChannel', 'invitedInChannel')
        .getOneOrFail();
      // old
      // return this.userRepository.findOneByOrFail({ username: identifier });
    }
    throw new EntityNotFoundError(User, {});
  }

  findOnebySocketId(identifier: string): Promise<User> {
    return this.userRepository.findOneByOrFail({ socketid: identifier });
  }

  // eslint-disable-next-line @typescript-eslint/no-unused-vars

  async updateUsername(id: number, username: any): Promise<void> {
    const result: UpdateResult = await this.userRepository.update(id, {
      username: username,
    });
    if (typeof result.affected != 'undefined' && result.affected < 1)
      throw new EntityNotFoundError(User, { id: id });
  }

  async updateSelectedMap(id: number, selectedMap: number): Promise<void> {
    const result: UpdateResult = await this.userRepository.update(id, {
      selectedMap: selectedMap,
    });
    if (typeof result.affected != 'undefined' && result.affected < 1)
      throw new EntityNotFoundError(User, { id: id });
  }

  remove(id: number) {
    console.log('This action removes a user with %d id', id);
  }

  async updateTwoFASecret(secret: string, id: number): Promise<any> {
    const result: UpdateResult = await this.userRepository.update(id, {
      twoFAsecret: secret,
      hasTwoFASecret: true,
    });
    if (typeof result.affected != 'undefined' && result.affected < 1)
      throw new EntityNotFoundError(User, { id: id });
  }

  async update2FAEnable(id: number, state: boolean) {
    const result: UpdateResult = await this.userRepository.update(id, {
      twoFAEnabled: state,
    });
    if (typeof result.affected != 'undefined' && result.affected < 1)
      throw new EntityNotFoundError(User, { id: id });
  }

  async updateStatus(id: number, newStatus: string): Promise<void> {
    const result: UpdateResult = await this.userRepository.update(id, {
      status: newStatus,
      lastLoginTimestamp:
        newStatus === 'online' ? new Date(Date.now()) : undefined,
    });
    if (typeof result.affected != 'undefined' && result.affected < 1)
      throw new EntityNotFoundError(User, { id: id });
  }

  async updateAchievements(id: number, newAchievement: number): Promise<void> {
    const user = await this.findOne(id);
    if (user.achievements.includes(newAchievement)) {
      console.log('Duplicate value present in Achievements, did not add to it');
      return Promise.resolve();
    }
    const result: UpdateResult = await this.userRepository.update(id, {
      achievements: () => `array_append(achievements, ${newAchievement})`,
    });
    if (typeof result.affected != 'undefined' && result.affected < 1)
      throw new EntityNotFoundError(User, { id: id });
  }

  async updateSocketid(id: number, newsocketid: string) {
    if (id === null || newsocketid === null)
      throw new Error('id or socketid is null');
    console.log('updateSocketid mit folgenden Werten', id, newsocketid);
    const result: UpdateResult = await this.userRepository.update(id, {
      socketid: newsocketid,
    });
    if (typeof result.affected != 'undefined' && result.affected < 1)
      throw new EntityNotFoundError(User, { id: id });
  }

  async addToOwnedChannel(userid: number, channelId: string) {
    const user = await this.findOne(userid);
    const channel = await this.channelRepository.findOneByOrFail({
      id: channelId,
    });

    console.log('User:', user);
    console.log('Channel:', channel);

    if (!channel || !user) {
      console.log('User or Channel not found');
      return;
    }
    user.ownedChannels = user.ownedChannels || []; // if user.ownedChannels is undefined, set it to an empty array
    user.ownedChannels.push(channel);
    await this.userRepository.save(user);
  }

  /*   async updateAchievements(id: number, newAchievement: number): Promise<void> {
    const result: UpdateResult = await this.userRepository.createQueryBuilder()
    .update(User)
    .set({ achievements: () => `array_append(achievements, ${newAchievement})` })
    .where('id = :id', { id: id })
    .execute();
    if (typeof result.affected != 'undefined' && result.affected < 1)
      throw new EntityNotFoundError(User, { id: id });
  } */

  async seedDatabase() {
    try {
      for (const user of mockUsers) {
        await this.userRepository.insert(user);
      }
    } catch (error) {
      console.log(error);
    }
  }
}
