import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { QueryFailedError, Repository } from 'typeorm';
import { CreateMessageInput } from './dto/create-message.input';
import { Message } from './entities/message.entity';

@Injectable()
export class MessagesService {
	constructor(
		@InjectRepository(Message)
		private messageRepository: Repository<Message>,
	) {}

	async findAll(): Promise<Message[]> {
		console.log('This action returns all messages');
		const allMessages = await this.messageRepository.find();
		return allMessages;
	}
	
	create(createMessageInput: CreateMessageInput): Promise<void> {
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
}
