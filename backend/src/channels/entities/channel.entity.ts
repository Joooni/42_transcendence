import { Inject } from "@nestjs/common";
import { Field, Int, ObjectType, registerEnumType } from "@nestjs/graphql";
import { PasswordService } from "src/password/password.service";
import { User } from "src/users/entities/user.entity";
import { BeforeInsert, Column, CreateDateColumn, Entity, JoinColumn, ManyToMany, ManyToOne, PrimaryGeneratedColumn } from "typeorm";

export enum ChannelType {
	public,
	private,
	protected,
}

registerEnumType(ChannelType, {
	name: 'ChannelType',
});

@ObjectType()
@Entity()
export class Channel {
	@Field(() => Int)
	@PrimaryGeneratedColumn('uuid')
	id: string;

	@ManyToOne(() => User)
	@JoinColumn()
	@Field()
	owner: User;

	@Field()
	@Column('text')
	name: string;

	@Field(type => ChannelType)
	type: ChannelType;

	@Field()
	password: string;

	constructor(@Inject(PasswordService) private readonly passwordService: PasswordService) {}

	@BeforeInsert()
	async hashPW() {
		this.password = await this.passwordService.hashPassword(this.password);
	}

	@Field()
	@CreateDateColumn()
	createdAt: Date;

	@ManyToMany(() => User)
	@JoinColumn()
	@Field(() => [User])
	users: User[];

	@ManyToMany(() => User)
	@JoinColumn()
	@Field(() => [User])
	admins: User[];

	@ManyToMany(() => User)
	@JoinColumn()
	@Field(() => [User])
	mutedUsers: User[];

	@ManyToMany(() => User)
	@JoinColumn()
	@Field(() => [User])
	invitedUsers: User[];

	@ManyToMany(() => User)
	@JoinColumn()
	@Field(() => [User])
	bannedUsers: User[];
}