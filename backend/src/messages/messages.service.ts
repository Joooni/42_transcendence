import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { EntityNotFoundError, Repository } from 'typeorm';
import { Message } from './entities/message.entity';
import { MessageObj } from 'src/objects/message';
import { Socket } from 'socket.io';
import { User } from 'src/users/entities/user.entity';
import { UsersService } from 'src/users/users.service';
import { ChannelsService } from 'src/channels/channels.service';

@Injectable()
export class MessagesService {
  constructor(
    @InjectRepository(Message) private messageRepository: Repository<Message>,
    private readonly userService: UsersService,
    private readonly channelsService: ChannelsService,
  ) {}

  async findAll(): Promise<Message[]> {
    console.log('This action returns all messages');
    const messages = await this.messageRepository
      .createQueryBuilder('message')
      .leftJoinAndSelect('message.sender', 'sender')
      .leftJoinAndSelect('message.receiverUser', 'receiverUser')
      .leftJoinAndSelect('message.receiverChannel', 'receiverChannel')
      .getMany();
    return messages;
  }

  // async create(createMessageInput: CreateMessageInput): Promise<Message> {
  //   console.log('The message is added in the database');
  //   const message = new Message();
  //   try {
  //     message.content = createMessageInput.content;
  //     message.id = createMessageInput.id;
  //     message.receiverUser = createMessageInput.receiver;
  //     message.sender = createMessageInput.sender;
  //     message.timestamp = createMessageInput.timestamp;

  //     this.messageRepository.insert(message);
  //   } catch (error) {
  //     if (!(error instanceof QueryFailedError)) return Promise.reject(error);
  //   }
  //   return Promise.resolve(message);
  // }

  async findMessagesDM(
    id: number | undefined,
    idReceiver: number | undefined,
  ): Promise<Message[]> {
    if (typeof id === 'undefined' || typeof idReceiver === 'undefined')
      throw new EntityNotFoundError(User, {});

    return await this.messageRepository
      .createQueryBuilder('message')
      .leftJoinAndSelect('message.sender', 'sender')
      .leftJoinAndSelect('message.receiverUser', 'receiverUser')
      .leftJoinAndSelect('message.receiverChannel', 'receiverChannel')
      .where(
        'message.receiverUser.id = :id AND message.sender.id = :idReceiver',
        {
          id: id,
          idReceiver: idReceiver,
        },
      )
      .orWhere(
        'message.receiverUser.id = :idReceiver AND message.sender.id = :id',
        { id: id, idReceiver: idReceiver },
      )
      .take(200)
      .getMany();
  }

  async findMessagesChannel(id: string): Promise<Message[]> {
    if (typeof id === 'undefined') throw new EntityNotFoundError(User, {});

    return await this.messageRepository
      .createQueryBuilder('message')
      .leftJoinAndSelect('message.sender', 'sender')
      .leftJoinAndSelect('message.receiverUser', 'receiverUser')
      .leftJoinAndSelect('message.receiverChannel', 'receiverChannel')
      .where('message.receiverChannel.id = :id', {
        id: id,
      })
      .take(200)
      .getMany();
  }

  async receiveMessage(client: Socket, message: MessageObj): Promise<void> {
    try {
      // Create the Message Entity
      const mesEntity = new Message();
      mesEntity.content = message.content;
      mesEntity.timestamp = message.timestamp;
      mesEntity.sender = await this.userService.findOne(message.sender.id);
      if (mesEntity.sender === undefined) {
        throw new Error('Sender does not exist');
      }

      if (message.receiverChannel !== undefined) {
        // Channel Messages
        mesEntity.receiverChannel = await this.channelsService.getChannelById(
          message.receiverChannel.id,
        );
        if (mesEntity.receiverChannel === undefined) {
          throw new Error('Channel does not exist');
        }
      } else {
        // DMs
        if (message.receiverUser === undefined) {
          throw new Error('Message without receiver');
        }
        mesEntity.receiverUser = await this.userService.findOne(
          message.receiverUser.id,
        );
        if (mesEntity.receiverUser === undefined) {
          throw new Error('Receiver does not exist');
        }
      }

      // Save in DB
      this.messageRepository.insert(mesEntity);
    } catch (error) {
      console.log('Error: \n', error);
    }
  }
}
