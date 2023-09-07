import { Inject } from '@nestjs/common';
import { Field, ObjectType } from '@nestjs/graphql';
import { Message } from 'src/messages/entities/message.entity';
import { PasswordService } from 'src/password/password.service';
import { User } from 'src/users/entities/user.entity';
import {
  BeforeInsert,
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  JoinTable,
  ManyToMany,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { ChannelMute } from './channelMute.entity';

@ObjectType()
@Entity()
export class Channel {
  @Field(() => String)
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Field(() => User)
  @ManyToOne(() => User, (user) => user.ownedChannels)
  @JoinColumn()
  owner: User;

  @Field()
  @Column('text')
  name: string;

  @Field(() => String)
  @Column('text')
  type: string;

  @Field({ nullable: true })
  password?: string;

  constructor(
    @Inject(PasswordService) private readonly passwordService: PasswordService,
  ) {}

  @BeforeInsert()
  async hashPW() {
    if (typeof this.password === 'string')
      this.password = await this.passwordService.hashPassword(this.password);
  }

  async comparePassword(password: string): Promise<boolean> {
    if (!this.password) {
      console.log('no password set for the channel:', this.name);
      return false;
    } else if (
      await this.passwordService.comparePassword(password, this.password)
    )
      return true;
    else return false;
  }

  @Field()
  @CreateDateColumn()
  createdAt: Date;

  @Field(() => [Message], { nullable: true })
  @OneToMany(() => Message, (message) => message.receiverChannel, {
    cascade: true,
  })
  @JoinColumn()
  messages: Message[];

  @Field(() => [User], { nullable: true })
  @ManyToMany(() => User, (user) => user.channelList, {
    eager: true,
    cascade: ['insert', 'update', 'remove'],
    onDelete: 'CASCADE',
  })
  @JoinTable()
  users: User[];

  @Field(() => [User], { nullable: true })
  @ManyToMany(() => User, (user) => user.adminInChannel, {
    eager: true,
    cascade: ['insert', 'update', 'remove'],
    onDelete: 'CASCADE',
  })
  @JoinTable()
  admins: User[];

  @Field(() => [ChannelMute], { nullable: true })
  @OneToMany(() => ChannelMute, (channelMute) => channelMute.channel)
  mutedUsers: ChannelMute[];

  @Field(() => [User], { nullable: true })
  @ManyToMany(() => User, (user) => user.invitedInChannel, {
    eager: true,
    cascade: ['insert', 'update', 'remove'],
    onDelete: 'CASCADE',
  })
  @JoinTable()
  invitedUsers: User[];

  @Field(() => [User], { nullable: true })
  @ManyToMany(() => User, (user) => user.bannedInChannel, {
    eager: true,
    cascade: ['insert', 'update', 'remove'],
    onDelete: 'CASCADE',
  })
  @JoinTable()
  bannedUsers: User[];
}
