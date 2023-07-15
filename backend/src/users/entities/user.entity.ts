import { Field, GraphQLTimestamp, Int, ObjectType } from '@nestjs/graphql';
import { Channel } from 'src/channels/entities/channel.entity';
import { Entity, Column, PrimaryColumn, Index, ManyToMany, JoinTable, ManyToOne, OneToMany, OneToOne, JoinColumn } from 'typeorm';

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
  ownedChannels?: Channel[];

  @Field(() => [Channel], { nullable: true })
  @ManyToMany(() => Channel)
  @JoinTable()
  channelList?: Channel[];

  @Field(() => [Channel], { nullable: true })
  @ManyToMany(() => Channel)
  @JoinTable()
  adminInChannel?: Channel[];

  @Field(() => [Channel], { nullable: true })
  @ManyToMany(() => Channel)
  @JoinTable()
  mutedInChannel?: Channel[];

  @Field(() => [Channel], { nullable: true })
  @ManyToMany(() => Channel)
  @JoinTable()
  invitedInChannel?: Channel[];

  bannedInChannel?: Channel[];
}
