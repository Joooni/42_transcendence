import { Module, OnModuleInit } from '@nestjs/common';
import { UsersService } from './users.service';
import { UsersResolver } from './users.resolver';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from './entities/user.entity';
import { UsersController } from './users.controller';
import { ConfigModule } from '@nestjs/config';
import { HttpModule } from '@nestjs/axios';

@Module({
  providers: [UsersResolver, UsersService],
  imports: [TypeOrmModule.forFeature([User]), ConfigModule, HttpModule],
  exports: [UsersService],
  controllers: [UsersController],
})
export class UsersModule implements OnModuleInit {
  constructor(
    private readonly usersService: UsersService,
  ) {}

  async onModuleInit() {
    console.log('Seeding database...');
    await this.usersService.seedDatabase();
    console.log('Database seeding completed!');
  }
}
