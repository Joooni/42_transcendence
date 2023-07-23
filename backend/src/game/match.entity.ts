import { Field, Int, ObjectType } from '@nestjs/graphql';
import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm';

@ObjectType()
@Entity()
export class Match {
  @Field(() => Int)
  @PrimaryGeneratedColumn({ type: 'int' })
  gameID: number;

  @Field()
  @Column()
  firstPlayer: string;

  @Field()
  @Column()
  secondPlayer: string;

  @Field(() => Int)
  @Column()
  goalsFirstPlayer: number;

  @Field(() => Int)
  @Column()
  goalsSecondPlayer: number;

  @Field()
  @Column()
  date: Date;
}
