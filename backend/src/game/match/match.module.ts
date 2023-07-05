import { Module } from '@nestjs/common';
import { MatchService } from './match.service';

@Module({
  providers: [MatchService],
  exports: [MatchService]
})
export class MatchModule {
	
	constructor(public matchService: MatchService) {}

}

