import { Field, Int, ObjectType } from "@nestjs/graphql";
import { Column, CreateDateColumn, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn, } from "typeorm";
import { User } from "../../users/entities/user.entity";

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
	receiver: User; //Or Channel

	@Field()
	@CreateDateColumn()
	timestamp: Date;

	@Field()
	@Column("text")
	content: string;
}