import { Module } from '@nestjs/common';
import { DataSource } from 'typeorm';
import { ConfigModule } from '@nestjs/config';
import { HttpModule } from '@nestjs/axios';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Match } from './match.entity';
import { GameService } from './game.service';
import { MatchModule } from './match/match.module';
import { GameResolver } from './game.resolver';

@Module({
  providers: [GameService, GameResolver],
  exports: [GameService],
  imports: [MatchModule, TypeOrmModule.forFeature([Match]), ConfigModule, HttpModule],
})

export class GameModule {
  constructor(public gameService: GameService) {}
}

