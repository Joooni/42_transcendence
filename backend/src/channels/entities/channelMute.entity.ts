import { Field, ObjectType } from '@nestjs/graphql';
import { User } from 'src/users/entities/user.entity';
import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { Channel } from './channel.entity';

@ObjectType()
@Entity()
export class ChannelMute {
  @Field(() => Number)
  @PrimaryGeneratedColumn()
  id: number;

  @Field(() => Channel)
  @ManyToOne(() => Channel, (channel) => channel.mutedUsers, {
    eager: true,
    cascade: ['insert', 'update', 'remove'],
    onDelete: 'CASCADE',
  })
  channel: Channel;

  @Field(() => User)
  @ManyToOne(() => User, (user) => user.mutedInChannel)
  user: User;

  @Field(() => Date)
  @Column({ type: 'timestamp' })
  mutedUntil: Date;
}
