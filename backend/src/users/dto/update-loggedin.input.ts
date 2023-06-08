import { ArgsType, Field } from '@nestjs/graphql';
import { IsNotEmpty } from 'class-validator';

@ArgsType()
export class updateUserLoggedInInput {
  @IsNotEmpty()
  @Field()
  isLoggedIn: boolean;
}
