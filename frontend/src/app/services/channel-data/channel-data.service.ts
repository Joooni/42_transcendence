import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';

import { Channel } from '../../models/channel';
import { CHANNELS } from '../../mock-data/mock_channels';
import graphQLService from '../graphQL/GraphQLService';
import { User } from 'src/app/models/user';
import { SocketService } from '../socket/socket.service';

@Injectable({
  providedIn: 'root'
})
export class ChannelDataService {

	channels = CHANNELS;

	constructor(private socket: SocketService) { }

	async getChannel(channelid: string): Promise<Channel> {
		const response = await graphQLService.query(
			`
				query getChannel($channelid: String!){
					channel(id: $channelid) {
						id
						name
						createdAt
						type
						owner {
							id
							username
							status
						}
						users {
							id
							username
							status
						}
						admins {
							id
							username
							status
						}
						mutedUsers {
							id
							user {
								id
							}
							mutedUntil
						}
						bannedUsers {
							id
							username
						}
					}
				}
			`,
			{ channelid },
			{ fetchPolicy: 'network-only' },
		);
		if (typeof response === 'undefined') {
			return Promise.reject(new Error('Channel not found'));
		}
		return response.channel;
	}

	async getChannelByName(name: string) {
		const response = await graphQLService.query(
			`
				query getChannelByName($name: String!){
					channelByName(name: $name) {
						id
						name
						createdAt
						type
						owner {
							id
							username
						}
						users {
							id
							username
						}
						admins {
							id
							username
						}
						mutedUsers {
							id
							username
						}
						bannedUsers {
							id
							username
						}
					}
				}
			`,
			{ name },
			{ fetchPolicy: 'network-only' },
		);
		if (typeof response === 'undefined') {
			return Promise.reject(new Error('Channel not found'));
		}
		return response.channel;
	}

	//lieber inkl. der MemberChannel
	async getOtherVisibleChannels(id: number): Promise<Channel[]> {		
		const response = await graphQLService.query(
			`
				query getOtherVisibleChannels($id: Int!) {
					visibleChannelsWithoutUser(id: $id) {
						id
						name
						createdAt
						users {
							id
							intra
						}
						type
					}
				}
			`,
			{ id },
			{ fetchPolicy: 'network-only' },
		);
		if (typeof response === 'undefined') {
			return Promise.reject(new Error('Channel not found'));
		}
		return response.visibleChannelsWithoutUser;
	}

	//Test Backend query
	async getChannels(): Promise<Channel[]> {
		const response = await graphQLService.query(
			`
				query {
					channels {
						id
						name
						createdAt
						type
						owner {
							id
						}
						users {
							id
						}
					}
				}
			`,
			undefined,
			{ fetchPolicy: 'network-only' },
		);
		if (typeof response === 'undefined') {
			return Promise.reject(new Error('Empty channel data'));
		}
		const channels = response.channels;
		console.log(channels);
		return channels;
	}

	joinChannel(channel: Channel, user: User) {
		console.log('Joining channel: ', channel.name);
		this.socket.emit('joinChannel', {
			channelid: channel.id,
			userid: user.id,
		});
	}
}
