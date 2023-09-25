import { Field, GraphQLTimestamp, Int, ObjectType } from '@nestjs/graphql';
import { Channel } from 'src/channels/entities/channel.entity';
import { ChannelMute } from 'src/channels/entities/channelMute.entity';
import { Match } from 'src/game/entitites/match.entity';
import {
  Entity,
  Column,
  PrimaryColumn,
  Index,
  ManyToMany,
  JoinTable,
  OneToMany,
  JoinColumn,
} from 'typeorm';

@ObjectType()
@Entity()
export class User {
  @Field(() => Int)
  @PrimaryColumn({ type: 'int', unique: true })
  id: number;

  @Field()
  @Column()
  intra: string;

  @Field()
  @Index()
  @Column({ unique: true })
  username: string;

  @Field()
  @Column()
  email: string;

  @Field()
  @Column()
  picture: string;

  @Field()
  @Column({ default: false })
  twoFAEnabled: boolean;

  @Column({ type: String, nullable: true })
  twoFAsecret!: string | null;

  @Field()
  @Column({ default: false })
  hasTwoFASecret: boolean;

  @Field()
  @Column({ default: 'offline' })
  status: string;

  @Field()
  @Column({ default: 0 })
  wins: number;

  @Field()
  @Column({ default: 0 })
  losses: number;

  @Field()
  @Column({ default: '' })
  socketid: string;

  @Field()
  @Column({ default: 0 })
  xp: number;

  @Field()
  @Column({ default: 0 })
  rank: number;

  @Field()
  @Column({ default: 1 })
  map: number;

  @Field(() => [Int])
  @Column({ type: 'integer', array: true, default: ['1'] })
  achievements: number[];

  @Field()
  @Column({ default: 1 })
  selectedMap: number;

  @Field(() => GraphQLTimestamp)
  @Column({ type: 'timestamptz', default: () => 'CURRENT_TIMESTAMP' })
  lastLoginTimestamp: Date;

  @Field(() => Channel, { nullable: true })
  @OneToMany(() => Channel, (channel) => channel.owner)
  @JoinColumn()
  ownedChannels: Channel[];

  @Field(() => [Channel], { nullable: true })
  @ManyToMany(() => Channel, (channel) => channel.users, {
    onDelete: 'CASCADE',
  })
  channelList: Channel[];

  @Field(() => [Channel], { nullable: true })
  @ManyToMany(() => Channel, (channel) => channel.admins)
  adminInChannel: Channel[];

  @Field(() => [ChannelMute], { nullable: true })
  @OneToMany(() => ChannelMute, (channelMute) => channelMute.user)
  mutedInChannel: ChannelMute[];

  @Field(() => [Channel], { nullable: true })
  @ManyToMany(() => Channel, (channel) => channel.invitedUsers)
  invitedInChannel: Channel[];

  @Field(() => [Channel], { nullable: true })
  @ManyToMany(() => Channel, (channel) => channel.bannedUsers)
  bannedInChannel: Channel[];

  @Field(() => [User], { nullable: true })
  @ManyToMany(() => User, (user) => user.friends)
  @JoinTable()
  friends: User[];

  @Field(() => [User], { nullable: true })
  @ManyToMany(() => User, (user) => user.incomingFriendRequests)
  @JoinTable()
  sendFriendRequests: User[];

  @Field(() => [User], { nullable: true })
  @ManyToMany(() => User, (user) => user.sendFriendRequests)
  incomingFriendRequests: User[];

  @Field(() => [User], { nullable: true })
  @ManyToMany(() => User, (user) => user.blockedFromOther)
  @JoinTable()
  blockedUsers: User[];

  @Field(() => [User], { nullable: true })
  @ManyToMany(() => User, (user) => user.blockedUsers)
  blockedFromOther: User[];

  @Field(() => [Match], { nullable: true })
  @OneToMany(() => Match, (match) => match.firstPlayer)
  matchesAsFirstPlayer: Match[];

  @Field(() => [Match], { nullable: true })
  @OneToMany(() => Match, (match) => match.secondPlayer)
  matchesAsSecondPlayer: Match[];
}
