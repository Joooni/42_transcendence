import { Field, ObjectType } from '@nestjs/graphql';
import { Message } from 'src/messages/entities/message.entity';
import { User } from 'src/users/entities/user.entity';
import {
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

  @Field(() => String, { nullable: true })
  @Column('text', { nullable: true })
  password?: string;

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
