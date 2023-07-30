import { Module, OnModuleInit } from '@nestjs/common';
import { UsersService } from './users.service';
import { UsersResolver } from './users.resolver';
import { DataSource } from 'typeorm';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from './entities/user.entity';
import { UsersController } from './users.controller';
import { ConfigModule } from '@nestjs/config';
import { HttpModule } from '@nestjs/axios';
import { Channel } from 'src/channels/entities/channel.entity';

@Module({
  providers: [UsersResolver, UsersService],
  imports: [
    TypeOrmModule.forFeature([User, Channel]),
    ConfigModule,
    HttpModule,
  ],
  exports: [UsersService],
  controllers: [UsersController],
})
export class UsersModule implements OnModuleInit {
  constructor(
    private dataSource: DataSource,
    private readonly usersService: UsersService,
  ) {}

  async onModuleInit() {
    // console.log('Seeding database with Kongs');
    await this.usersService.seedDatabase();
  }
}
