import { Component, OnInit } from '@angular/core';

import { UserDataService } from '../services/user-data.service';
import { UserRelationService } from '../services/user-relation.service';
import { ChannelDataService } from '../services/channel-data.service';
import { User } from '../objects/user';
import { Channel } from '../objects/channel';
import { CookieService } from 'ngx-cookie-service';

@Component({
  selector: 'app-chat',
  templateUrl: './chat.component.html',
  styleUrls: ['./chat.component.css']
})
export class ChatComponent implements OnInit {
	
	friends?: number[];
	blocked?: number[];
	allUsers?: User[];

	memberChannels?: string[];
	visibleChannels?: Channel[];

	showFriends: boolean = true;
	showOtherUsers: boolean = false;
	showChannels: boolean = true;
	showBlocked: boolean = false;

	selectedChannel?: Channel;
	selectedUser?: User;

	constructor(
	private userDataService: UserDataService,
	private userRelationService: UserRelationService,
	private channelDataService: ChannelDataService,
	private cookie: CookieService
	) {}

	ngOnInit(): void {
		this.userDataService.getAllUsersFor(parseInt(this.cookie.get("userid"))).subscribe(users => this.allUsers = users);
		this.userRelationService.getFriendsOf(parseInt(this.cookie.get("userid"))).subscribe(friends => this.friends = friends);
		this.userRelationService.getBlockedOf(parseInt(this.cookie.get("userid"))).subscribe(blocked => this.blocked = blocked);
		this.channelDataService.getAllChannelsVisibleFor(parseInt(this.cookie.get("userid"))).subscribe(visible => this.visibleChannels = visible);
		this.channelDataService.getChannelsOf(parseInt(this.cookie.get("userid"))).subscribe(member => this.memberChannels = member);
	}

	changeShowFriends() {
		if (this.showFriends == true)
			this.showFriends = false;
		else
			this.showFriends = true;
	}

	changeShowOtherUsers() {
		if (this.showOtherUsers == true)
			this.showOtherUsers = false;
		else
			this.showOtherUsers = true;
	}

	changeShowChannels() {
		if (this.showChannels == true)
			this.showChannels = false;
		else
			this.showChannels = true;
	}

	changeShowBlocked() {
		if (this.showBlocked == true)
			this.showBlocked = false;
		else
			this.showBlocked = true;
	}

	selectChannel(channel: Channel) {
		if (!this.memberChannels?.includes(channel.name))
			return;
		if (this.selectedUser)
			this.selectedUser = undefined;
		this.selectedChannel = channel;
	}

	selectUser(user: User) {
		if (this.selectedChannel)
			this.selectedChannel = undefined;
		this.selectedUser = user;
	}
}
