import { Resolver, Query, Args, Int, Mutation } from '@nestjs/graphql';
import { UsersService } from './users.service';
import { User } from './entities/user.entity';
import { JwtPayload } from '../auth/strategy/jwt.strategy';
import { CurrentJwtPayload } from './decorator/current-jwt-payload.decorator';
import { UpdateUsernameInput } from './dto/update-username.input';
import { UpdateUserStatusInput } from './dto/update-status.input';
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

  @Query(() => [User], { name: 'allUsers' })
  findAll() {
    return this.usersService.findAll();
  }

  @Query(() => [User], { name: 'allUsersExceptMyself' })
  findAllExceptMyself(@CurrentJwtPayload() jwtPayload: JwtPayload) {
    return this.usersService.findAllExceptMyself(jwtPayload.id);
  }

  @Query(() => User, { name: 'userById' })
  findOneById(
    @Args('id', { type: () => Int, nullable: true }) id: number | undefined,
    @CurrentJwtPayload() jwtPayload: JwtPayload,
  ) {
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
  async updateSelectedMap(
    @CurrentJwtPayload() jwtPayload: JwtPayload,
    @Args('selectedMap', { type: () => Number }) selectedMap: number,
  ) {
    await this.usersService.updateSelectedMap(jwtPayload.id, selectedMap);
    return this.usersService.findOne(jwtPayload.id);
  }

  @Mutation(() => User)
  async updateStatus(
    @CurrentJwtPayload() jwtPayload: JwtPayload,
    @Args() updateUserStatusInput: UpdateUserStatusInput,
  ) {
    await this.usersService.updateStatus(
      jwtPayload.id,
      updateUserStatusInput.status,
    );
    return this.usersService.findOne(jwtPayload.id);
  }

  @Mutation(() => User)
  async updateAchievements(
    @Args('id', { type: () => Number }) id: number,
    @Args('newAchievement', { type: () => Number }) updateAchievement: number,
  ) {
    console.log('This action updates user achievements');
    await this.usersService.updateAchievements(id, updateAchievement);
    return this.usersService.findOne(id);
  }
}
