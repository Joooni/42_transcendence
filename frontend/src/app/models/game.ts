import { User } from "./user";

export interface Game {
	id: number;
	player1_name?: string;
	player1_id: number;
	player1_score: number;
	player1_profile_pic?: string;
	player2_name?: string;
	player2_id: number;
	player2_score: number;
	player2_profile_pic?: string;
	game_running: boolean;
	//time: Timestamp?;
}

export interface GameHistory {
	game_id: number;
	player_score: number;
	other_id: number;
	other_name?: string;
	other_img?: string;
	other_score: number;
	result: string; //win or loose
	xp: number;
	//time / date
}

export interface Match {
	gameID: number;
	firstPlayer: User;
	secondPlayer: User;
	goalsFirstPlayer: number;
	goalsSecondPlayer: number;
	xpFirstPlayer: number;
    xpSecondPlayer: number;
	timestamp: Date;
}