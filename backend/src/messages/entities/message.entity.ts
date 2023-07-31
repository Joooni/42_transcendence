import { Field, Int, ObjectType } from '@nestjs/graphql';
import { Channel } from 'src/channels/entities/channel.entity';
import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { User } from '../../users/entities/user.entity';

@ObjectType()
@Entity()
export class Message {
  @Field(() => Int)
  @PrimaryGeneratedColumn({ type: 'int' })
  id: number;

  @ManyToOne(() => User)
  @JoinColumn()
  @Field(() => User)
  sender: User;

  @ManyToOne(() => User)
  @JoinColumn()
  @Field(() => User)
  receiverUser?: User;

  @ManyToOne(() => Channel)
  @JoinColumn()
  @Field(() => Channel)
  receiverChannel?: Channel;

  @Field()
  @CreateDateColumn()
  timestamp: Date;

  @Field()
  @Column('text')
  content: string;
}
