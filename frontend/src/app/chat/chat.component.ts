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

	memberChannels?: Channel[];
	otherVisibleChannels?: Channel[];

	showFriends: boolean = true;
	showOtherUsers: boolean = false;
	showChannels: boolean = true;
	showBlocked: boolean = false;

	selectedChannel?: Channel;
	selectedUser?: User;

	hasUnreadMessages: boolean = true;
	createChannelName?: string;

	constructor(
		private userDataService: UserDataService,
		private userRelationService: UserRelationService,
		private channelDataService: ChannelDataService,
		private messageService: MessageService,
		private socket: SocketService,
	) {}

	async ngOnInit(): Promise<void> {
		await this.userDataService.findSelf().then(user => {
			this.activeUser = user;
			//to be updated when Channel and Relations are fully implemented? Maybe even define services differently...
			this.userRelationService.getFriendsOf(this.activeUser.id).subscribe(friends => this.friends = friends);
			this.userRelationService.getBlockedOf(this.activeUser.id).subscribe(blocked => this.blocked = blocked);
			
			
			this.channelDataService.getOtherVisibleChannels(this.activeUser.id).then(other => this.otherVisibleChannels = other);
			
			//This should work now:
			this.memberChannels = this.activeUser.channelList;
			//this.channelDataService.getChannelsOf(this.activeUser.id).subscribe(member => this.memberChannels = member);
			console.log('memberChannels: ', this.memberChannels);
		});

		this.userDataService.findAllExceptMyself().then(users => this.allUsers = users);

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
		// If it is a memberchannel, the user is allowed to select it
		// if (!this.memberChannels?.includes(channel.name))
		// 	return;
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

	createChannel() {
		// const channelname = 'TestChannel';
		if (!this.createChannelName)
			return;
		//console.log('Button clicked, channelname: ', this.createChannelName);
		this.socket.emit('createChannel', { 
			channelname: this.createChannelName,
			ownerid: this.activeUser?.id,
		});
		this.createChannelName = undefined;
	}

	joinChannel(channel: Channel) {
		console.log('Joining channel: ', channel.name);
		this.socket.emit('joinChannel', {
			channelid: channel.id,
			userid: this.activeUser?.id,
		});
	}

	async leaveChannel(channel: Channel) {
		console.log('Leaving channel: ', channel.name);

		const dbChannel = await this.channelDataService.getChannel(channel.id);
		if (!dbChannel) {
			console.log('Channel does not exist anymore');
			return;
		}
		if (dbChannel.owner.id === this.activeUser?.id) {
			console.log("You can't leave, because you are the owner");
			return;
		}
		this.socket.emit('leaveChannel', {
			channelid: channel.id,
			userid: this.activeUser?.id,
		});
	}
}
