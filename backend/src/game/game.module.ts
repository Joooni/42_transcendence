import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { HttpModule } from '@nestjs/axios';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Match } from './entitites/match.entity';
import { User } from 'src/users/entities/user.entity';
import { Channel } from 'src/channels/entities/channel.entity';
import { GameService } from './game.service';
import { MatchModule } from './match/match.module';
import { GameResolver } from './game.resolver';
import { UsersService } from 'src/users/users.service';

@Module({
  providers: [GameService, GameResolver, UsersService],
  exports: [GameService],
  imports: [
    MatchModule,
    TypeOrmModule.forFeature([Match, User, Channel]),
    ConfigModule,
    HttpModule,
  ],
})
export class GameModule {
  constructor(private gameService: GameService) {}
}
