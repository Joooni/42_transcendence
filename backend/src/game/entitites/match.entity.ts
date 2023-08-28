import { Field, Int, ObjectType } from '@nestjs/graphql';
import { User } from 'src/users/entities/user.entity';
import {
	Column,
	CreateDateColumn,
	Entity,
	JoinColumn,
	ManyToOne,
	PrimaryGeneratedColumn,
  } from 'typeorm';

@ObjectType()
@Entity()
export class Match {
  @Field(() => Int)
  @PrimaryGeneratedColumn({ type: 'int' })
  gameID: number;

  @ManyToOne(() => User)
  @JoinColumn()
  @Field(() => User)
  firstPlayer: User;

  @ManyToOne(() => User)
  @JoinColumn()
  @Field(() => User)
  secondPlayer: User;

  @Field(() => Int)
  @Column()
  goalsFirstPlayer: number;

  @Field(() => Int)
  @Column()
  goalsSecondPlayer: number;

  @Field()
  @CreateDateColumn()
  timestamp: Date;
}
