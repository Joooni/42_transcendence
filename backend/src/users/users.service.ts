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
import { Server } from 'socket.io';

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
      this.updateRanksByXP();
    } catch (error) {
      if (!(error instanceof QueryFailedError)) return Promise.reject(error);
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      const existingUsers: User[] = await this.userRepository.find({
        where: { username: Like(`${createUserInput.username}%`) },
      });
      if (existingUsers.length == 0) return Promise.reject(error);
      createUserInput.username = createUserInput.username + '_copycat';
      await this.userRepository.insert(createUserInput);
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

  async findAllSortedRanks(): Promise<User[]> {
    return await this.userRepository
      .createQueryBuilder('user')
      .orderBy('user.rank', 'ASC')
      .addOrderBy('user.id')
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
        .leftJoinAndSelect('user.friends', 'friends')
        .leftJoinAndSelect('user.sendFriendRequests', 'sendFriendRequests')
        .leftJoinAndSelect(
          'user.incomingFriendRequests',
          'incomingFriendRequests',
        )
        .leftJoinAndSelect('user.blockedUsers', 'blockedUsers')
        .leftJoinAndSelect('user.blockedFromOther', 'blockedFromOther')
        .leftJoinAndSelect('user.matchesAsFirstPlayer', 'matchesAsFirstPlayer')
        .leftJoinAndSelect(
          'user.matchesAsSecondPlayer',
          'matchesAsSecondPlayer',
        )
        .getOneOrFail();
    } else if (typeof identifier === 'string') {
      return await this.userRepository
        .createQueryBuilder('user')
        .where({ username: identifier })
        .leftJoinAndSelect('user.ownedChannels', 'ownedChannels')
        .leftJoinAndSelect('user.channelList', 'channelList')
        .leftJoinAndSelect('user.adminInChannel', 'adminInChannel')
        .leftJoinAndSelect('user.mutedInChannel', 'mutedInChannel')
        .leftJoinAndSelect('user.invitedInChannel', 'invitedInChannel')
        .leftJoinAndSelect('user.friends', 'friends')
        .leftJoinAndSelect('user.sendFriendRequests', 'sendFriendRequests')
        .leftJoinAndSelect(
          'user.incomingFriendRequests',
          'incomingFriendRequests',
        )
        .leftJoinAndSelect('user.blockedUsers', 'blockedUsers')
        .leftJoinAndSelect('user.blockedFromOther', 'blockedFromOther')
        .getOneOrFail();
    }
    throw new EntityNotFoundError(User, {});
  }

  findOnebySocketId(identifier: string): Promise<User> {
    return this.userRepository.findOneByOrFail({ socketid: identifier });
  }

  async updateUsername(id: number, username: any): Promise<void> {
    const result: UpdateResult = await this.userRepository.update(id, {
      username: username,
    });
    if (typeof result.affected != 'undefined' && result.affected < 1)
      throw new EntityNotFoundError(User, { id: id });
  }

  async sendFriendRequest(server: Server, ownid: number, otherid: number) {
    try {
      const user = await this.findOne(ownid);
      const friend = await this.findOne(otherid);

      if (user.incomingFriendRequests.includes(friend)) {
        this.acceptFriendRequest(server, ownid, otherid);
        return;
      } else if (
        !user.sendFriendRequests.includes(friend) &&
        !user.friends.includes(friend)
      )
        user.sendFriendRequests.push(friend);

      await this.userRepository.save(user);

      server.to(user.socketid).emit('updateNotifications', {});
      server.to(friend.socketid).emit('updateNotifications', {});
    } catch (error) {
      console.log(error);
    }
  }

  async acceptFriendRequest(server: Server, ownid: number, otherid: number) {
    try {
      const user = await this.findOne(ownid);
      const friend = await this.findOne(otherid);
      user.incomingFriendRequests = user.incomingFriendRequests.filter(
        (item) => item.id !== friend.id,
      );

      if (!user.friends.includes(friend)) user.friends.push(friend);
      if (!friend.friends.includes(user)) friend.friends.push(user);

      // Achivment: found a friend
      const num1 = user.achievements.find((i) => i == 5);
      if (!num1) user.achievements.push(5);
      const num2 = friend.achievements.find((i) => i == 5);
      if (!num2) friend.achievements.push(5);

      await this.userRepository.save(friend);
      await this.userRepository.save(user);
      server.to(user.socketid).emit('updateUserList', {});
      server.to(friend.socketid).emit('updateUserList', {});

      server.to(user.socketid).emit('updateNotifications', {});
      server.to(friend.socketid).emit('updateNotifications', {});
    } catch (error) {
      console.log(error);
    }
  }

  async declineFriendRequest(server: Server, ownid: number, otherid: number) {
    try {
      const user = await this.findOne(ownid);
      const friend = await this.findOne(otherid);
      user.incomingFriendRequests = user.incomingFriendRequests.filter(
        (item) => item.id !== friend.id,
      );
      await this.userRepository.save(user);
      server.to(user.socketid).emit('updateNotifications', {});
      server.to(friend.socketid).emit('updateNotifications', {});
    } catch (error) {
      console.log(error);
    }
  }

  async withdrawFriendRequest(server: Server, ownid: number, otherid: number) {
    try {
      const user = await this.findOne(ownid);
      const friend = await this.findOne(otherid);
      user.sendFriendRequests = user.sendFriendRequests.filter(
        (item) => item.id !== friend.id,
      );
      await this.userRepository.save(user);
      server.to(user.socketid).emit('updateNotifications', {});
      server.to(friend.socketid).emit('updateNotifications', {});
    } catch (error) {
      console.log(error);
    }
  }

  async removeFriend(server: Server, ownid: number, otherid: number) {
    try {
      const user = await this.findOne(ownid);
      const friend = await this.findOne(otherid);
      user.friends = user.friends.filter((item) => item.id !== friend.id);
      friend.friends = friend.friends.filter((item) => item.id !== user.id);
      await this.userRepository.save(user);
      await this.userRepository.save(friend);
      server.to(user.socketid).emit('updateUserList', {});
      server.to(friend.socketid).emit('updateUserList', {});
    } catch (error) {
      console.log(error);
    }
  }

  async blockUser(server: Server, ownid: number, otherid: number) {
    try {
      const user = await this.findOne(ownid);
      const other = await this.findOne(otherid);
      user.friends = user.friends.filter((item) => item.id !== other.id);
      other.friends = other.friends.filter((item) => item.id !== user.id);
      await this.userRepository.save(other);
      user.blockedUsers.push(other);
      await this.userRepository.save(user);
      server.to(user.socketid).emit('updateUserList', {});
      server.to(other.socketid).emit('updateUserList', {});
    } catch (error) {
      console.log(error);
    }
  }

  async unblockUser(server: Server, ownid: number, otherid: number) {
    try {
      const user = await this.findOne(ownid);
      const other = await this.findOne(otherid);
      user.blockedUsers = user.blockedUsers.filter(
        (item) => item.id !== otherid,
      );
      await this.userRepository.save(user);
      server.to(user.socketid).emit('updateUserList', {});
      server.to(other.socketid).emit('updateUserList', {});
    } catch (error) {
      console.log(error);
    }
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

  async resetAllSocketidAndStatus() {
    const users: User[] = await this.findAll();
    users.forEach(async (user) => {
      await this.updateSocketid(user.id, '');
      await this.updateStatus(user.id, 'offline');
    });
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

  async updatePicture(id: number, newPicture: string): Promise<void> {
    const result: UpdateResult = await this.userRepository.update(id, {
      picture: newPicture,
    });
    if (typeof result.affected != 'undefined' && result.affected < 1)
      throw new EntityNotFoundError(User, { id: id });
  }

  /*
  wollen wir hier ein resetPicture einbauen, damit man auf das default (aka intra) Bild zurückswitchen kann?
  */

  async getUserSortedByRank() {
    return await this.userRepository
      .createQueryBuilder('user')
      .orderBy('user.rank', 'ASC')
      .addOrderBy('user.id')
      .getMany();
  }

  async getTopThree() {
    return await this.userRepository
      .createQueryBuilder('user')
      .orderBy('user.rank', 'ASC')
      .addOrderBy('user.id')
      .take(3)
      .getMany();
  }

  async updateRanksByXP(): Promise<User[]> {
    const sortedUsers = await this.userRepository
      .createQueryBuilder('user')
      .orderBy('user.xp', 'DESC')
      .addOrderBy('user.id')
      .getMany();
    for (let i = 0; i < sortedUsers.length; i++) {
      //Archivment: King of the Jungle
      let achievementChanged = false;
      if (i == 0) {
        const archiv = sortedUsers[0].achievements.find((num) => num == 7);
        if (!archiv) {
          sortedUsers[0].achievements.push(7);
          achievementChanged = true;
        }
      }

      if (sortedUsers[i].rank !== i + 1) {
        sortedUsers[i].rank = i + 1;
        await this.userRepository.save(sortedUsers[i]);
      } else if (achievementChanged) {
        await this.userRepository.save(sortedUsers[i]);
      }
    }
    console.log('User Ranks updated');
    return sortedUsers;
  }

  async calcXP(
    player1: User,
    player1score: number,
    player2: User,
    player2score: number,
  ): Promise<any> {
    try {
      let player1xp = 0;
      let player2xp = 0;
      let xpDiff = 0;

      if (player1score > player2score) {
        player1xp = 5 + (player1score - player2score);
        xpDiff = player2.xp - player1.xp;
        if (xpDiff < 0) xpDiff = 0;
        if (xpDiff > 100) xpDiff = 100;
        player1xp = player1xp + Math.trunc(player1xp * (xpDiff / 100));
      } else {
        player2xp = 5 + (player2score - player1score);
        xpDiff = player1.xp - player2.xp;
        if (xpDiff < 0) xpDiff = 0;
        player2xp = player2xp + Math.trunc(player2xp * (xpDiff / 100));
      }
      return { player1xp: player1xp, player2xp: player2xp };
    } catch (error) {
      console.log('Error: while calcXP' + error);
    }
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
