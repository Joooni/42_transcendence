import { HttpModule } from '@nestjs/axios';
import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { DataSource } from 'typeorm';
import { Message } from './entities/message.entity';
import { MessagesService } from './messages.service';
import { MessagesResolver } from './messages.resolver';
import { User } from 'src/users/entities/user.entity';
import { UsersService } from 'src/users/users.service';
import { UsersResolver } from 'src/users/users.resolver';

@Module({
	providers: [MessagesService, MessagesResolver, UsersService, UsersResolver],
	imports: [
		TypeOrmModule.forFeature([Message, User]),
		ConfigModule,
		HttpModule
	],
	exports: [MessagesService],
})
export class MessagesModule {
	constructor(public messagesService: MessagesService) {}
}
