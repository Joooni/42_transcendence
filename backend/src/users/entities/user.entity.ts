import { Field, Int, ObjectType } from '@nestjs/graphql';
import { Entity, Column, PrimaryColumn, Index } from 'typeorm';

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
  @Column({ default: 'offline' })
  status: string;

  @Field()
  @Column({ default: 0 })
  wins: number;

  @Field()
  @Column({ default: 0 })
  losses: number;

  @Field()
  @Column({ default: false })
  isLoggedIn: boolean;

  @Field()
  @Column({ default: '' })
  socketId: string;
}
