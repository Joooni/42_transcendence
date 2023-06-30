import { ConsoleLogger, Inject, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Db, EntityNotFoundError, QueryFailedError, Repository } from 'typeorm';
import { CreateMessageInput } from './dto/create-message.input';
import { Message } from './entities/message.entity';
import { MessageObj } from 'src/objects/message';
import { Socket } from 'socket.io';
import { Server } from 'http';
import { User } from 'src/users/entities/user.entity';
import { UsersService } from 'src/users/users.service';
import { SocketModule } from 'src/socket/socket.module';
import { SocketService } from 'src/socket/socket.service';

@Injectable()
export class MessagesService {
	constructor(
		@InjectRepository(Message) private messageRepository: Repository<Message>,
		// @InjectRepository(User) private userRepository: Repository<User>,
		private readonly userService: UsersService,
		// @Inject(SocketService) private socketService: SocketService,
	) {}

	async findAll(): Promise<Message[]> {
		console.log('This action returns all messages');
		return this.messageRepository.find();
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
		} catch (error)
		{
			if (!(error instanceof QueryFailedError)) return Promise.reject(error);
		}
		return Promise.resolve(message);
	}

	async receiveMessage(client: Socket,  message: MessageObj): Promise<void> {
		
		let dbUserSender: User = new User();
		let dbUserReceiver: User = new User();

		try {
			// Get the Senderuser from the database
			if(!('intra' in message.sender)) {
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
				
				// Send message
				// this.socketService.getSocket(dbUserReceiver.id)?.emit('message', "Hello");
				// console.log('Send the message to receiver now', dbUserReceiver.id, socket?.id);
				// this.socketService.getSocket(dbUserReceiver.id)?.emit('message', {
				
				
				// this.socketGateway.server.emit('message', {
				// 	id: undefined,
				// 	sender: mesEntity.sender,
				// 	receiver: mesEntity.receiver,
				// 	timestamp: mesEntity.timestamp,
				// 	content: mesEntity.content,
				// });

			} else {
				console.log('Error: Receiver not found');
			}
		} catch (error) {
			console.log('Error: \n', error);
		}
	}
}
