import { UseGuards } from '@nestjs/common';
import { Resolver, Query, Args, Int } from '@nestjs/graphql';
import { JwtAuthGuard } from 'src/auth/guard/jwt.guard';
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

  @Query(() => [Message], { name: 'messagesDM' })
  async messagesDM(
    @Args('id', { type: () => Int, nullable: true }) id: number | undefined,
    @Args('idReceiver', { type: () => Int, nullable: true })
    idReceiver: number | undefined,
  ): Promise<Message[]> {
    return this.messagesService.findMessagesDM(id, idReceiver);
  }

  @Query(() => [Message], { name: 'messagesChannel' })
  async messagesChannel(
    @Args('id', { type: () => String, nullable: true }) id: string,
  ): Promise<Message[]> {
    return this.messagesService.findMessagesChannel(id);
  }
}
