import { HttpModule } from '@nestjs/axios';
import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { DataSource } from 'typeorm';
import { Message } from './entities/message.entity';
import { MessagesService } from './messages.service';
import { MessagesResolver } from './messages.resolver';

@Module({
	providers: [MessagesService, MessagesResolver],
	imports: [TypeOrmModule.forFeature([Message]), ConfigModule, HttpModule],
	exports: [MessagesService],
})
export class MessagesModule {
	constructor(private dataSource: DataSource) {}
}
