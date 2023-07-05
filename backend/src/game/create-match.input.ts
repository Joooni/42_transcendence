import { Field, Int } from '@nestjs/graphql';
import { IsNotEmpty } from 'class-validator';

export class createMatch {

	@Field(() => Int)
	@IsNotEmpty()
	gameID:	number;
	
	@Field()
	firstPlayer:	string;
	
	@Field()
	secondPlayer:	string;
	
	@Field()
	goalsFirstPlayer:	number;
	
	@Field()
	goalsSecondPlayer:	number;
	
	// @Field()
	// date:	Date;
	
	}