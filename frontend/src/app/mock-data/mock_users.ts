import { User } from "../models/user";

export const USERS: User[] = [
	{
		id: 1,
		intra: "mmuster",
		firstname: "Max",
		lastname: "Mustermann",
		username: "MusterDude",
		email: "mmuster@mock.com",
		picture: "../../assets/cage.jpeg",
		twoFAEnabled: true,
		status: "online",
		wins: 12,
		losses: 23,
		map: 2,
	},
	{
		id: 2,
		intra: "jdoe",
		firstname: "Jon",
		lastname: "Doe",
		username: "JonDude",
		email: "jdoe@mock.com",
		picture: "../../assets/cage.jpeg",
		twoFAEnabled: false,
		status: "offline",
		wins: 1,
		losses: 12,
		map: 1,
	},
	{
		id: 3,
		intra: "jbiden",
		firstname: "Joe",
		lastname: "Biden",
		username: "BigJoe",
		email: "jbiden@mock.com",
		picture: "../assets/biden.jpeg",
		twoFAEnabled: true,
		status: "gaming",
		wins: 600,
		losses: 120,
		map: 3,
	},
	{
		id: 4,
		intra: "dtrump",
		firstname: "Donald",
		lastname: "Trump",
		username: "TheRealD",
		email: "dtrump@mock.com",
		picture: "../assets/trump.jpeg",
		twoFAEnabled: false,
		status: "offline",
		wins: 1,
		losses: 120,
		map: 3,
	},
	{
		id: 5,
		intra: "smischni",
		firstname: "Saskia",
		lastname: "Mischnick",
		username: "saskia",
		email: "smischni@student.42wolfsburg.de",
		picture: "../assets/profile.jpg",
		twoFAEnabled: true,
		status: "online",
		wins: 15,
		losses: 12,
		map: 1,
	},
	{
		id: 6,
		intra: "jsubel",
		firstname: "Jonas",
		lastname: "Subel",
		username: "jonas",
		email: "jsubel@student.42wolfsburg.de",
		picture: "../assets/profile.jpg",
		twoFAEnabled: false,
		status: "online",
		wins: 12,
		losses: 15,
		map: 1,
	},
	{
		id: 7,
		intra: "tjairus",
		firstname: "Triinu",
		lastname: "Jairus",
		username: "triinu",
		email: "tjairus@student.42wolfsburg.de",
		picture: "../assets/profile.jpg",
		twoFAEnabled: false,
		status: "gaming",
		wins: 15,
		losses: 12,
		map: 3,
	},
	{
		id: 8,
		intra: "fmollenh",
		firstname: "Ferenc",
		lastname: "Mollenhauer",
		username: "ferenc",
		email: "fmollenh@student.42wolfsburg.de",
		picture: "../assets/profile.jpg",
		twoFAEnabled: false,
		status: "online",
		wins: 15,
		losses: 12,
		map: 2,
	},
	{
		id: 9,
		intra: "fsemke",
		firstname: "Florian",
		lastname: "Semke",
		username: "florian",
		email: "fsemke@student.42wolfsburg.de",
		picture: "../assets/profile.jpg",
		twoFAEnabled: false,
		status: "offline",
		wins: 15,
		losses: 12,
		map: 2,
	},
	// this is an empty user that can be used to see if findUser functions work
	// {
	// 	id: -1,
	// 	intra: '',
	// 	firstname: '',
	// 	lastname: '',
	// 	username: '',
	// 	email: '',
	// 	picture: '',
	// 	twoFAEnabled: false,
	// 	twoFAsecret: '',
	// 	status: '',
	// 	wins: 0,
	// 	losses: 0,
	// 	map: 0,
	// 	isLoggedIn: false
	// },
];