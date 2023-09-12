import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UsersModule } from './users/users.module';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from './users/entities/user.entity';
import { Match } from './game/entitites/match.entity';
import { AuthModule } from './auth/auth.module';
import { UsersController } from './users/users.controller';
import { GraphQLModule } from '@nestjs/graphql';
import { ApolloDriver } from '@nestjs/apollo';
import { join } from 'path';
import { PassportModule } from '@nestjs/passport';
import { SocketModule } from './socket/socket.module';
import { Message } from './messages/entities/message.entity';
import { MessagesModule } from './messages/messages.module';
import { GameModule } from './game/game.module';
import { ChannelsModule } from './channels/channels.module';
import { PasswordService } from './password/password.service';
import { Channel } from './channels/entities/channel.entity';
import { ServeStaticModule } from '@nestjs/serve-static';
import { SocketController } from './socket/socket.controller';
import { ChannelMute } from './channels/entities/channelMute.entity';
import { ChannelMuteModule } from './channels/channel-mute/channel-mute.module';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true, expandVariables: true }),
    ServeStaticModule.forRoot({
      rootPath: join(__dirname, '..', 'uploads/profile_pictures'),
      serveRoot: '/uploads/profile_pictures',
    }),
    UsersModule,
    MessagesModule,
    GameModule,
    SocketModule,
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => ({
        type: 'postgres',
        host: configService.get('DB_HOST'),
        port: configService.get<number>('DB_PORT'),
        username: configService.get('DB_USERNAME'),
        password: configService.get('DB_PASSWORD'),
        database: configService.get('DB_NAME'),
        entities: [User, Message, Match, Channel, ChannelMute],
        synchronize: true,
      }),
    }),
    GraphQLModule.forRoot({
      driver: ApolloDriver,
      playground: true,
      autoSchemaFile: join(process.cwd(), 'src/schema.gql'),
      cors: {
        origin: `http://${process.env.DOMAIN}`,
        credentials: true,
      },
    }),
    AuthModule,
    PassportModule,
    ChannelMuteModule,
    ChannelsModule,
  ],
  controllers: [AppController, UsersController, SocketController],
  providers: [AppService, PasswordService],
})
export class AppModule {}
