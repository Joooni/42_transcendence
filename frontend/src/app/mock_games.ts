import { Game } from "./game";

export const GAMES: Game[] = [
	{
		id: 0,
		player1_name: 'Werner',
		player1_id: 0,
		player1_score: 1,
		player1_profile_pic: '../../assets/biden.jpeg',
		player2_name: 'Dagobert',
		player2_id: 1,
		player2_score: 2,
		player2_profile_pic: '../../assets/cage.jpeg',
		game_running: true
	},
	{
		id: 1,
		player1_name: 'Gustav',
		player1_id: 1,
		player1_score: 5,
		player1_profile_pic: '../../assets/trump.jpeg',
		player2_name: 'Gandalf',
		player2_id: 3,
		player2_score: 8,
		player2_profile_pic: '../../assets/profile.jpg',
		game_running: true
	},
	{
		id: 1,
		player1_name: 'MusterDude',
		player1_id: 1,
		player1_score: 10,
		player1_profile_pic: '../../assets/profile.jpg',
		player2_name: 'Manfred',
		player2_id: 3,
		player2_score: 0,
		player2_profile_pic: '../../assets/profile.jpg',
		game_running: false
	},
	{
		id: 1,
		player1_name: 'Herbert',
		player1_id: 2,
		player1_score: 10,
		player1_profile_pic: '../../assets/profile.jpg',
		player2_name: 'MusterDude',
		player2_id: 1,
		player2_score: 0,
		player2_profile_pic: '../../assets/profile.jpg',
		game_running: false
	}
]