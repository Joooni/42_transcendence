import { ConsoleLogger, Inject, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Db, EntityNotFoundError, QueryFailedError, Repository } from 'typeorm';
import { CreateMessageInput } from './dto/create-message.input';
import { Message } from './entities/message.entity';
import { MessageObj } from 'src/objects/message';
import { Socket } from 'socket.io';
import { Server } from 'http';
import { SocketGateway } from 'src/socket/socket.gateway';
import { User } from 'src/users/entities/user.entity';
import { UsersService } from 'src/users/users.service';

@Injectable()
export class MessagesService {
	constructor(
		@InjectRepository(Message)
		private messageRepository: Repository<Message>,
		@InjectRepository(User)
		private server: Server,
		// private userRepository: Repository<User>,
		private readonly userService: UsersService,
	) {}

	async findAll(): Promise<Message[]> {
		console.log('This action returns all messages');
		return this.messageRepository.find();
	}
	
	async create(createMessageInput: CreateMessageInput): Promise<void> {
		console.log('The message is added in the database');
		try {
			const message = new Message();
			message.content = createMessageInput.content;
			message.id = createMessageInput.id;
			message.receiver = createMessageInput.receiver;
			message.sender = createMessageInput.sender;
			message.timestamp = createMessageInput.timestamp;
			
			this.messageRepository.insert(message);
		} catch (error)
		{
			if (!(error instanceof QueryFailedError)) return Promise.reject(error);
		}
		return Promise.resolve();
	}

	async receiveMessage(client: Socket,  message: MessageObj): Promise<void> {

		let dbUserSender: User = new User();
		let dbUserReceiver: User = new User();
		
		try {
			// Get the Senderuser from the database
			dbUserSender = await this.userService.findOne(message.sender.id);
			
			// Get the Receiver from the database
			if ('intra' in message.receiver) {
				dbUserReceiver = await this.userService.findOne(message.receiver.id);
			}
			else {
				// Not a user, but a channel
				console.log('Messages to a channel are not working yet!');
			}
			
			//Test output
			console.log('Das ist der Sender User: ', dbUserSender);
			if ('intra' in message.receiver) {
				console.log('Das ist der Receiver User: ', dbUserReceiver);
			}

			// Create the Message Entity
			const mesEntity = new Message();
			mesEntity.sender = dbUserSender;
			mesEntity.receiver = dbUserReceiver;
			mesEntity.content = message.content;
			mesEntity.timestamp = message.timestamp;

			// Save & Send the message
			this.messageRepository.insert(mesEntity);
			
			//NEED to send to the right user
			//this.server.emit('message', mesEntity); //to all user
			client.emit('message', mesEntity); // answer the sender
			//client. to(dbUserReceiver.socketId).emit('message', mesEntity); // to specific user
		}
		catch (error) {
			console.log('Error: \n', error);
		}
	}
}
