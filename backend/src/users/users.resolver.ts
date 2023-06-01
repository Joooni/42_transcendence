import { Resolver, Query, Args, Int, Mutation } from '@nestjs/graphql';
import { UsersService } from './users.service';
import { User } from './entities/user.entity';
import { JwtPayload } from '../auth/strategy/jwt.strategy';
import { CurrentJwtPayload } from './decorator/current-jwt-payload.decorator';
import { UpdateUsernameInput } from './dto/update-username.input';

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
  findOneById(
    @Args('id', { type: () => Int, nullable: true }) id: number | undefined,
    @CurrentJwtPayload() jwtPayload: JwtPayload,
  ) {
    if (typeof id === 'undefined') return this.usersService.findOne(jwtPayload.id);
    return this.usersService.findOne(id);
  }

  @Query(() => User, { name: 'userByName' })
  findOneByUsername(@Args('username') username: string) {
    return this.usersService.findOne(username);
  }

  @Mutation(() => User)
  async updateUsername(
    @CurrentJwtPayload() jwtPayload: JwtPayload,
    @Args() updateUserUsernameInput: UpdateUsernameInput,
  ) {
    console.log("jwtPayload: ", jwtPayload);
    // console.log("jwtPayload.id: ", jwtPayload.id);
    await this.usersService.updateUsername(
     // jwtPayload.id,
      1,
      updateUserUsernameInput.username,
    );
    return this.usersService.findOne(updateUserUsernameInput.username); // change back to jwtPayload.id
  }

  @Mutation(() => User)
  async updateLoggedIn(
    @CurrentJwtPayload() jwtPayload: JwtPayload,
    @Args() updateUserUsernameInput: UpdateUsernameInput,
  ) {
    wait this.usersService.updateLoggedIn(
      JwtPayload.id,
      updateUserLoggedInInput.status,
    );
    return this.usersService.findOne(jwdPayload.id);
  }
}
