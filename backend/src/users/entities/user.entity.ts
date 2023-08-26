import { Field, GraphQLTimestamp, Int, ObjectType } from '@nestjs/graphql';
import { Channel } from 'src/channels/entities/channel.entity';
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
  @Column()
  firstname: string;

  @Field()
  @Column()
  lastname: string;

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

  @Field(() => [Channel], { nullable: true })
  @ManyToMany(() => Channel, (channel) => channel.mutedUsers)
  mutedInChannel: Channel[];

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
}
