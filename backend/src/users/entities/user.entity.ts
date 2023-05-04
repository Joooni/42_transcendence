import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class User {
	@PrimaryGeneratedColumn()
	id: number;

	@Column()
	intra: string;

	@Column()
	firstname: string;

	@Column()
	lastname: string;

	@Column({ unique: true })
	username: string;

	@Column()
	email: string;

	@Column()
	picture: string;

	@Column({ default: false })
	twoFAEnabled: boolean;

	@Column({ type: String, nullable: true })
	twoFAsecret: string | null;

	@Column({ default: 'offline' })
	status: string;

	@Column()
	wins: number;

	@Column()
	losses: number;
}
