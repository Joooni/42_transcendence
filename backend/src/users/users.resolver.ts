import { Resolver, Query, Args, Int } from '@nestjs/graphql';
import { UsersService } from './users.service';
import { User } from './entities/user.entity';

/**
 * compared to RESTful APIs, graphQL uses three different requests:
 * Query: used to retrieve data from server (REST analogue: GET)
 * Mutation: used to create and modify data on server (POST, PUT, DELETE)
 * Subscription: receive real-time updates from server and notificatgions when changes or updates occur
 */
@Resolver('User')
export class UsersResolver {
  constructor(private readonly usersService: UsersService) {}

  @Query(() => [User], { name: 'users' })
  findAll() {
    return this.usersService.findAll();
  }

  @Query(() => User, { name: 'user' })
  findOneById(@Args('id', { type: () => Int, nullable: true }) id: number) {
    return this.usersService.findOne(id);
  }

  @Query(() => User, { name: 'user' })
  findOneByUsername(@Args('username') username: string) {
    return this.usersService.findOne(username);
  }
}
