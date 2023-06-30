import { ArgsType, Field } from '@nestjs/graphql';
import { IsNotEmpty } from 'class-validator';

@ArgsType()
export class UpdateUserStatusInput {
  @IsNotEmpty()
  @Field()
  status: string;
}
