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
//for adding mockUsers
import { mockUser1, mockUser2 } from './entities/user.entity.mock';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User) private readonly userRepository: Repository<User>,
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
    console.log('This action returns all users');
    return this.userRepository.find();
  }

  findOne(identifier: number | string): Promise<User> {
    console.log('This action returns a user');
    if (typeof identifier === 'number')
      return this.userRepository.findOneByOrFail({ id: identifier });
    else if (typeof identifier === 'string')
      return this.userRepository.findOneByOrFail({ username: identifier });
    throw new EntityNotFoundError(User, {});
  }

  // eslint-disable-next-line @typescript-eslint/no-unused-vars

  async updateUsername(id: number, username: any): Promise<void> {
    const result: UpdateResult = await this.userRepository.update(id, {
      username: username,
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
//function to add mockUsers to userRepository
  async seedDatabase(){
    await this.userRepository.save(mockUser1);
    await this.userRepository.save(mockUser2);
  }

  async updateLoggedIn(id: number, state: boolean) {
    const result: UpdateResult = await this.userRepository.update(id, {
      isLoggedIn: state,
    });
    if (typeof result.affected != 'undefined' && result.affected < 1)
      throw new EntityNotFoundError(User, { id: id });
  }
}
