import { Channel } from '../models/channel';

export const CHANNELS: Channel[] = [
	{
		id: 1,
		name: "Public-Member",
		ownerid: 3,
		type: "PUBLIC",
		users: [1, 3, 5, 7, 9],
		admins: [3, 5],
		muted: [],
		invited: [],
		banned: [],
		hasUnreadMessagesToActiveUser: true
	},
	{
		id: 2,
		name: "Public",
		ownerid: 5,
		type: "PUBLIC",
		users: [2, 3, 4, 5, 6],
		admins: [5, 6],
		muted: [],
		invited: [],
		banned: [],
	},
	{
		id: 3,
		name: "Private-Member",
		ownerid: 8,
		type: "PRIVATE",
		users: [1, 3, 4, 5, 6],
		admins: [5, 6, 8],
		muted: [],
		invited: [],
		banned: [],
	},
	{
		id: 4,
		name: "Private-Invited",
		ownerid: 8,
		type: "PRIVATE",
		users: [3, 4, 5, 6],
		admins: [5, 6, 8],
		muted: [],
		invited: [1],
		banned: [],
	},
	{
		id: 5,
		name: "Private",
		ownerid: 8,
		type: "PRIVATE",
		users: [3, 4, 5, 6],
		admins: [5, 6, 8],
		muted: [],
		invited: [],
		banned: [],
	},
	{
		id: 6,
		name: "Own",
		ownerid: 1,
		type: "PUBLIC",
		users: [1, 3, 4, 5, 6],
		admins: [1, 5, 6, 8],
		muted: [],
		invited: [],
		banned: [],
		hasUnreadMessagesToActiveUser: true
	},
	{
		id: 7,
		name: "Admin",
		ownerid: 8,
		type: "PUBLIC",
		users: [1, 3, 4, 5, 6],
		admins: [1, 5, 6, 8],
		muted: [],
		invited: [],
		banned: [],
	},
	{
		id: 8,
		name: "Muted",
		ownerid: 8,
		type: "PUBLIC",
		users: [1, 3, 4, 5, 6],
		admins: [5, 6, 8],
		muted: [1],
		invited: [],
		banned: [],
	},
	{
		id: 9,
		name: "Banned",
		ownerid: 8,
		type: "PUBLIC",
		users: [3, 4, 5, 6],
		admins: [5, 6, 8],
		muted: [],
		invited: [],
		banned: [1],
	}
]