import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';

import { Channel } from '../../objects/channel';
import { CHANNELS } from '../../objects/mock_channels';

@Injectable({
  providedIn: 'root'
})
export class ChannelDataService {

	channels = CHANNELS;

	constructor() { }

	//update - BE call instead
	getChannelsOf(id: number): Observable<string[]> {
		const channelsOfUser: string[] = [];
		for (let i = 0; i < this.channels.length; i++) {
			const tmpChannel = this.channels[i].users.find(elem => elem === id);
			if (tmpChannel)
				channelsOfUser.push(this.channels[i].name);
		}
		return of(channelsOfUser);
	}

	//update - BE call instead
	getAllChannelsVisibleFor(id: number): Observable<Channel[]> {
		const channelsVisibleForUser: Channel[] = [];
		for (let i = 0; i < this.channels.length; i++) {
			if (this.channels[i].users.find(elem => elem === id))
				channelsVisibleForUser.push(this.channels[i]);
			else if (this.channels[i].type !== 'PRIVATE' && !this.channels[i].banned.find(elem => elem === id))
				channelsVisibleForUser.push(this.channels[i]);
			else if (this.channels[i].type === 'PRIVATE' && this.channels[i].invited.find(elem => elem === id))
			channelsVisibleForUser.push(this.channels[i]);
		}
		return of(channelsVisibleForUser);
	}
}
