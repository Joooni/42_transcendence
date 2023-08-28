// import { Module } from '@nestjs/common';
// import { DataSource } from 'typeorm';
// import { ConfigModule } from '@nestjs/config';
// import { HttpModule } from '@nestjs/axios';
// import { TypeOrmModule } from '@nestjs/typeorm';

import { Resolver, Query, Args, Int } from '@nestjs/graphql';
import { JwtPayload } from '../auth/strategy/jwt.strategy';
import { CurrentJwtPayload } from './../users/decorator/current-jwt-payload.decorator';
import { Match } from './entitites/match.entity';
import { GameService } from './game.service';

@Resolver()
export class GameResolver {
  constructor(private readonly gameService: GameService) {}

  @Query(() => [Match], { name: 'matches' })
  findAllMatches() {
    return this.gameService.findAllMatches();
  }

  @Query(() => Match, { name: 'match' })
  findMatchById(
    @Args('id', { type: () => Int, nullable: true }) id: number | undefined,
    @CurrentJwtPayload() jwtPayload: JwtPayload,
  ) {
    if (typeof id === 'undefined')
      return this.gameService.findMatchById(jwtPayload.id);
    return this.gameService.findMatchById(id);
  }

}
