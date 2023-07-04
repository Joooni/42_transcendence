import { UseGuards } from '@nestjs/common';
import { Resolver, Query, Args, Int, Mutation } from '@nestjs/graphql';
import { JwtAuthGuard } from 'src/auth/guard/jwt.guard';
import { JwtPayload } from 'src/auth/strategy/jwt.strategy';
import { CurrentJwtPayload } from 'src/users/decorator/current-jwt-payload.decorator';
import { CreateMessageInput } from './dto/create-message.input';
import { Message } from './entities/message.entity';
import { MessagesService } from './messages.service';

@Resolver('Message')
@UseGuards(JwtAuthGuard)
export class MessagesResolver {
  constructor(private readonly messagesService: MessagesService) {}

  @Query(() => [Message], { name: 'messages' })
  async findAll(): Promise<Message[]> {
    return this.messagesService.findAll();
  }

  // @Mutation(() => Message)
  // async addMessage(
  // 	@CurrentJwtPayload() jwtPayload: JwtPayload,
  // 	@Args() createMessage: CreateMessageInput,
  // ) {
  // 	await this.messagesService.create(createMessage);
  // }
}
