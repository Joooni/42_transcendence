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
		xp: 434,
		rank: 2,
		map: 2,
		achievements: [1, 2, 3],
		ownedChannels: [],
		channelList: [],
		adminInChannel: [],
		mutedInChannel: [],
		invitedInChannel: [],
		bannedInChannel: [],
		friends: [],
		sendFriendRequests: [],
		incomingFriendRequests: [],
		blockedUsers: [],
		blockedFromOther: []
	},
	// {
	// 	id: 2,
	// 	intra: "jdoe",
	// 	firstname: "Jon",
	// 	lastname: "Doe",
	// 	username: "JonDude",
	// 	email: "jdoe@mock.com",
	// 	picture: "../../assets/cage.jpeg",
	// 	twoFAEnabled: false,
	// 	status: "offline",
	// 	wins: 1,
	// 	losses: 12,
	// 	xp: 4322,
	// 	// map: 1,
	// 	achievements: [4, 5, 6]
	// },
	// {
	// 	id: 3,
	// 	intra: "jbiden",
	// 	firstname: "Joe",
	// 	lastname: "Biden",
	// 	username: "BigJoe",
	// 	email: "jbiden@mock.com",
	// 	picture: "../assets/biden.jpeg",
	// 	twoFAEnabled: true,
	// 	status: "gaming",
	// 	wins: 600,
	// 	losses: 120,
	// 	xp: 894,
	// 	// map: 3,
	// 	achievements: [2, 4, 6]
	// },
	// {
	// 	id: 4,
	// 	intra: "dtrump",
	// 	firstname: "Donald",
	// 	lastname: "Trump",
	// 	username: "TheRealD",
	// 	email: "dtrump@mock.com",
	// 	picture: "../assets/trump.jpeg",
	// 	twoFAEnabled: false,
	// 	status: "offline",
	// 	wins: 1,
	// 	losses: 120,
	// 	xp: 5433,
	// 	// map: 3,
	// 	achievements: [1, 3, 5]
	// },
	// {
	// 	id: 5,
	// 	intra: "smischni",
	// 	firstname: "Saskia",
	// 	lastname: "Mischnick",
	// 	username: "saskia",
	// 	email: "smischni@student.42wolfsburg.de",
	// 	picture: "../assets/profile.jpg",
	// 	twoFAEnabled: true,
	// 	status: "online",
	// 	wins: 15,
	// 	losses: 12,
	// 	xp: 5672,
	// 	// map: 1,
	// 	achievements: [1, 2, 5]
	// },
	// {
	// 	id: 6,
	// 	intra: "jsubel",
	// 	firstname: "Jonas",
	// 	lastname: "Subel",
	// 	username: "jonas",
	// 	email: "jsubel@student.42wolfsburg.de",
	// 	picture: "../assets/profile.jpg",
	// 	twoFAEnabled: false,
	// 	status: "online",
	// 	wins: 12,
	// 	losses: 15,
	// 	xp: 7832,
	// 	// map: 1,
	// 	achievements: [2, 3, 6]
	// },
	// {
	// 	id: 7,
	// 	intra: "tjairus",
	// 	firstname: "Triinu",
	// 	lastname: "Jairus",
	// 	username: "triinu",
	// 	email: "tjairus@student.42wolfsburg.de",
	// 	picture: "../assets/profile.jpg",
	// 	twoFAEnabled: false,
	// 	status: "gaming",
	// 	wins: 15,
	// 	losses: 12,
	// 	xp: 129,
	// 	// map: 3,
	// 	achievements: [1, 4, 5]
	// },
	// {
	// 	id: 8,
	// 	intra: "fmollenh",
	// 	firstname: "Ferenc",
	// 	lastname: "Mollenhauer",
	// 	username: "ferenc",
	// 	email: "fmollenh@student.42wolfsburg.de",
	// 	picture: "../assets/profile.jpg",
	// 	twoFAEnabled: false,
	// 	status: "online",
	// 	wins: 15,
	// 	losses: 12,
	// 	xp: 327,
	// 	// map: 2,
	// 	achievements: [4, 6]
	// },
	// {
	// 	id: 98468,
	// 	intra: "fsemke",
	// 	firstname: "Florian",
	// 	lastname: "Semke",
	// 	username: "florian",
	// 	email: "fsemke@student.42wolfsburg.de",
	// 	picture: "../assets/profile.jpg",
	// 	twoFAEnabled: false,
	// 	status: "offline",
	// 	wins: 15,
	// 	losses: 12,
	// 	xp: 4214,
	// 	// map: 2,
	// 	achievements: [4, 5]
	// },
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
	// },
];