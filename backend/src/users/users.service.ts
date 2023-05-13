import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { CreateUserInput } from './dto/create-user.input';
import { ConfigService } from '@nestjs/config';
import { HttpService } from '@nestjs/axios';
import { User } from './entities/user.entity';
import { EntityNotFoundError, Like, QueryFailedError, Repository } from 'typeorm';
@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User) private readonly userRepository: Repository<User>,
    private readonly configService: ConfigService,
    private readonly httpService: HttpService,
  ) {}

  async create(createUserInput: CreateUserInput): Promise<void> {
    console.log("This action adds a new user");
    //repository.insert method is used to insert a new entity or an array of entities into the database.
    try {
      console.log(createUserInput);
      await this.userRepository.insert(createUserInput);
    } catch (error) {
      if (!(error instanceof QueryFailedError)) return Promise.reject(error);
      const existingUsers: User[] = await this.userRepository.find({
        where: { username: Like('${createUserInput.username}%') },
      });
      if (existingUsers.length === 0) return Promise.reject(error);
      // here should be a part where a user cant be created because of conflicting usernames
      // so we check the database for the same username and add a number to its end
    }
    return Promise.resolve();
  }

  async findAll(): Promise<User[]> {
    console.log("This action returns all users");
    return this.userRepository.find();
  }

  findOne(identifier: number | string): Promise<User> {
    console.log("This action returns a user");
    if (typeof identifier === 'number')
      return this.userRepository.findOneByOrFail({id: identifier})
    else if (typeof identifier === 'string')
      return this.userRepository.findOneByOrFail({username: identifier})
    throw new EntityNotFoundError(User,{});
  }

  remove(id: number) {
    console.log("This action removes a user with %d id", id);
  }
}
