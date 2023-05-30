import { ArgsType, Field } from '@nestjs/graphql';
import { IsNotEmpty, Length, Matches } from 'class-validator';

@ArgsType()
export class UpdateUsernameInput {
  @IsNotEmpty()
  @Field()
  username: string;
}