import { Field, InputType, Int } from '@nestjs/graphql';
import { IsNotEmpty } from 'class-validator';
import { User } from 'src/users/entities/user.entity';

@InputType()
export class CreateMessageInput {
  @Field(() => Int)
  @IsNotEmpty()
  id: number;

  @Field(() => User)
  @IsNotEmpty()
  sender: User;

  @Field(() => User)
  @IsNotEmpty()
  receiver: User; //Or Channel

  @Field()
  timestamp: Date;

  @Field()
  @IsNotEmpty()
  content: string;
}
