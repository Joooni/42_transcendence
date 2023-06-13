import { Field, Int } from "@nestjs/graphql";
import { User } from "src/users/entities/user.entity";
import { Column, PrimaryGeneratedColumn } from "typeorm";

export class Message {

@Field(() => Int)
@PrimaryGeneratedColumn({ type: 'int'})
id: number;

@Field()
@Column()
sender: User;

@Field()
@Column()
receiver: User /*| Channel*/;

@Field()
@Column()
content: string;

@Field()
@Column()
timestamp: Date;
}
