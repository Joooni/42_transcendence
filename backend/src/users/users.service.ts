import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { CreateUserInput } from './dto/create-user.input';
import { UpdateUserInput } from './dto/update-user.input';
import { ConfigService } from '@nestjs/config';
import { HttpService } from '@nestjs/axios';
import { User } from './entities/user.entity';
import { EntityNotFoundError, Repository } from 'typeorm';
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
    await this.userRepository.insert(createUserInput);
    // here needs to go some error management - username already in use, more...
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

  update(id: number, updateUserInput: UpdateUserInput) {
    console.log("This action updates a user with %d id", id);
  }

  remove(id: number) {
    console.log("This action removes a user with %d id", id);
  }
}
