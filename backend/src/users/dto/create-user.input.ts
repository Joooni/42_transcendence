import { Field, Int } from '@nestjs/graphql';
import { IsEmail, IsNotEmpty, IsUrl } from 'class-validator';

export class CreateUserInput {
  @Field(() => Int)
  @IsNotEmpty()
  id: number;

  @Field()
  intra: string;

  @Field()
  firstname: string;

  @Field()
  lastname: string;

  @Field()
  @IsNotEmpty()
  username: string;

  @Field()
  @IsEmail()
  email: string;

  @Field()
  @IsUrl()
  picture: string;

  @Field()
  twoFAEnabled: boolean;

  @Field()
  status: string;

  @Field()
  wins: number;

  @Field()
  losses: number;

}
