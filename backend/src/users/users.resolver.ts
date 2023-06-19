import { Resolver, Query, Args, Int, Mutation } from '@nestjs/graphql';
import { UsersService } from './users.service';
import { User } from './entities/user.entity';
import { JwtPayload } from '../auth/strategy/jwt.strategy';
import { CurrentJwtPayload } from './decorator/current-jwt-payload.decorator';
import { UpdateUsernameInput } from './dto/update-username.input';
import { updateUserLoggedInInput } from './dto/update-loggedin.input';
import { JwtAuthGuard } from 'src/auth/guard/jwt.guard';
import { UseGuards } from '@nestjs/common';

/**
 * compared to RESTful APIs, graphQL uses three different requests:
 * Query: used to retrieve data from server (REST analogue: GET)
 * Mutation: used to create and modify data on server (POST, PUT, DELETE)
 * Subscription: receive real-time updates from server and notificatgions when changes or updates occur
 */
@Resolver('User')
@UseGuards(JwtAuthGuard)
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
    console.log('jwtPayload.id: ', jwtPayload.id);
    if (typeof id === 'undefined')
      return this.usersService.findOne(jwtPayload.id);
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
    await this.usersService.updateUsername(
      jwtPayload.id,
      updateUserUsernameInput.username,
    );
    return this.usersService.findOne(jwtPayload.id);
  }

  @Mutation(() => User)
  async updateLoggedIn(
    @CurrentJwtPayload() jwtPayload: JwtPayload,
    @Args() updateUserLoggedInInput: updateUserLoggedInInput,
  ) {
    await this.usersService.updateLoggedIn(
      jwtPayload.id,
      updateUserLoggedInInput.isLoggedIn,
    );
    return this.usersService.findOne(jwtPayload.id);
  }

  // Test function:
  // @Mutation(() => User)
  // async createUser(
  //   @CurrentJwtPayload() jwtPayload: JwtPayload,
  //   @Args('id') id: number,
  //   @Args('intra') intra: string,
  //   @Args('firstname') firstname: string,
  //   @Args('lastname') lastname: string,
  //   @Args('username') username: string,
  //   @Args('email') email: string,
  //   @Args('picture') picture: string,
  //   @Args('twoFAEnabled') twoFAEnabled: boolean,
  //   @Args('status') status: string,
  //   @Args('wins') wins: number,
  //   @Args('losses') losses: number,
  //   @Args('isLoggedIn') isLoggedIn: boolean,
  // ) {
  //   return this.usersService.createUser(
  //     id,
  //     intra,
  //     firstname,
  //     lastname,
  //     username,
  //     email,
  //     picture,
  //     twoFAEnabled,
  //     status,
  //     wins,
  //     losses,
  //     isLoggedIn,
  //     );
  // }
}
