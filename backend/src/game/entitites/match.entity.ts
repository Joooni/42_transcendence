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

  @Field(() => User)
  @ManyToOne(() => User, (user) => user.matchesAsFirstPlayer)
  @JoinColumn()
  firstPlayer: User;

  @Field(() => User)
  @ManyToOne(() => User, (user) => user.matchesAsSecondPlayer)
  @JoinColumn()
  secondPlayer: User;

  @Field(() => Int)
  @Column()
  goalsFirstPlayer: number;

  @Field(() => Int)
  @Column()
  goalsSecondPlayer: number;

  @Field(() => Int)
  @Column({ default: 0 })
  xpFirstPlayer: number;

  @Field(() => Int)
  @Column({ default: 0 })
  xpSecondPlayer: number;

  @Field()
  @CreateDateColumn()
  timestamp: Date;
}
