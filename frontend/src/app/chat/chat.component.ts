import { Component, OnInit } from '@angular/core';

import { UserDataService } from '../services/user-data/user-data.service';
import { UserRelationService } from '../services/user-relation/user-relation.service';
import { ChannelDataService } from '../services/channel-data/channel-data.service';
import { User } from '../models/user';
import { Channel } from '../models/channel';
import { CookieService } from 'ngx-cookie-service';
import { ChatDirectMessageComponent } from './chat-direct-message/chat-direct-message.component';
import { MessageService } from '../services/message/message.service';
import { SocketService } from '../services/socket/socket.service';

@Component({
  selector: 'app-chat',
  templateUrl: './chat.component.html',
  styleUrls: ['./chat.component.css']
})
export class ChatComponent implements OnInit {

	activeUser?: User;

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

	hasUnreadMessages: boolean = true;

	constructor(
		private userDataService: UserDataService,
		private userRelationService: UserRelationService,
		private channelDataService: ChannelDataService,
		private cookie: CookieService,
		private messageService: MessageService,
		private socket: SocketService,
	) {}

	ngOnInit(): void {
		this.userDataService.findSelf().then(user => this.activeUser = user);
		// for FE-testing - to be deleted when BE provides test data
		// this.userDataService.getAllUsers().subscribe(users => this.allUsers = users);

		// real function to user
		this.userDataService.findAll().then(users => this.allUsers = users);

		this.userRelationService.getFriendsOf(parseInt(this.cookie.get("userid"))).subscribe(friends => this.friends = friends);
		this.userRelationService.getBlockedOf(parseInt(this.cookie.get("userid"))).subscribe(blocked => this.blocked = blocked);
		this.channelDataService.getAllChannelsVisibleFor(parseInt(this.cookie.get("userid"))).subscribe(visible => this.visibleChannels = visible);
		this.channelDataService.getChannelsOf(parseInt(this.cookie.get("userid"))).subscribe(member => this.memberChannels = member);
		this.socket.listen('identify').subscribe(() => {
			this.socket.emit('identify', this.activeUser?.id);
		});
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
		this.messageService.changeOfDM('change of DM');
	}
}
