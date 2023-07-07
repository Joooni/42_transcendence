import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { EntityNotFoundError, QueryFailedError, Repository } from 'typeorm';
import { CreateMessageInput } from './dto/create-message.input';
import { Message } from './entities/message.entity';
import { MessageObj } from 'src/objects/message';
import { Socket } from 'socket.io';
import { User } from 'src/users/entities/user.entity';
import { UsersService } from 'src/users/users.service';

@Injectable()
export class MessagesService {
  constructor(
    @InjectRepository(Message) private messageRepository: Repository<Message>,
    // @InjectRepository(User) private userRepository: Repository<User>,
    private readonly userService: UsersService, // @Inject(SocketService) private socketService: SocketService,
  ) {}

  async findAll(): Promise<Message[]> {
    console.log('This action returns all messages');
    const messages = await this.messageRepository
      .createQueryBuilder('message')
      .leftJoinAndSelect('message.sender', 'sender')
      .leftJoinAndSelect('message.receiver', 'receiver')
      .getMany();
    return messages;
  }

  async create(createMessageInput: CreateMessageInput): Promise<Message> {
    console.log('The message is added in the database');
    const message = new Message();
    try {
      message.content = createMessageInput.content;
      message.id = createMessageInput.id;
      message.receiver = createMessageInput.receiver;
      message.sender = createMessageInput.sender;
      message.timestamp = createMessageInput.timestamp;

      this.messageRepository.insert(message);
    } catch (error) {
      if (!(error instanceof QueryFailedError)) return Promise.reject(error);
    }
    return Promise.resolve(message);
  }

  async findMessagesDM(
    id: number | undefined,
    idReceiver: number | undefined,
  ): Promise<Message[]> {
    if (typeof id === 'undefined' || typeof idReceiver === 'undefined')
      throw new EntityNotFoundError(User, {});

    return await this.messageRepository
      .createQueryBuilder('message')
      .leftJoinAndSelect('message.sender', 'sender')
      .leftJoinAndSelect('message.receiver', 'receiver')
      .where('message.receiver.id = :id AND message.sender.id = :idReceiver', {
        id: id,
        idReceiver: idReceiver,
      })
      .orWhere(
        'message.receiver.id = :idReceiver AND message.sender.id = :id',
        { id: id, idReceiver: idReceiver },
      )
      .take(200)
      .getMany();
  }

  async receiveMessage(client: Socket, message: MessageObj): Promise<void> {
    let dbUserSender: User = new User();
    let dbUserReceiver: User = new User();

    try {
      // Get the Senderuser from the database
      if (!('intra' in message.sender)) {
        //Message to channel
        console.log("Message to channel isn't working yet");
        return;
      }
      dbUserSender = await this.userService.findOne(message.sender.id);

      // Get the Receiver from the database
      dbUserReceiver = await this.userService.findOne(message.receiver.id);

      // Create the Message Entity
      if (dbUserReceiver && dbUserReceiver.id) {
        const mesEntity = new Message();
        mesEntity.sender = dbUserSender;
        mesEntity.receiver = dbUserReceiver;
        mesEntity.content = message.content;
        mesEntity.timestamp = message.timestamp;

        // Save in DB
        this.messageRepository.insert(mesEntity);
      } else {
        console.log('Error: Receiver not found');
      }
    } catch (error) {
      console.log('Error: \n', error);
    }
  }
}
