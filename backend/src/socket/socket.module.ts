import { HttpModule } from '@nestjs/axios';
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Message } from 'src/messages/entities/message.entity';
import { MessagesModule } from 'src/messages/messages.module';
import { MessagesService } from 'src/messages/messages.service';
import { User } from 'src/users/entities/user.entity';
import { UsersService } from 'src/users/users.service';
import { SocketGateway } from './socket.gateway';
import { GameModule } from '../game/game.module';
import { GameService } from 'src/game/game.service';

@Module({
  imports: [
    MessagesModule,
    TypeOrmModule.forFeature([Message, User]),
    HttpModule,
    GameModule
  ],
  providers: [SocketGateway, MessagesService, UsersService],
	// exports: [SocketGateway]
})


export class SocketModule {

	constructor(private gameService: GameService) {}

}
