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
import { delay } from 'rxjs';
import { ChannelType } from '../models/channel-type.enum';

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

	newChannelName?: string;
	newChannelNameInvalid: boolean = false;

	selectedChannelType: ChannelType = ChannelType.public;

	setChannelPassword?: string;
	enterChannelPassword?: string;
	channelPasswordInvalid: boolean = false;

	channelToJoin?: Channel;

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

	async selectChannel(channel: Channel) {
		const findChannel = this.memberChannels?.find(elem => elem.id === channel.id);
		if (!findChannel)
			return;
		if (this.selectedUser)
			this.selectedUser = undefined;
		await this.channelDataService.getChannel(channel.id)
			.then(rtrnChannel => this.selectedChannel = rtrnChannel)
		this.messageService.changeOfDM('change of channel');
		this.socket.emit('joinChannelRoom', { channelid: channel.id, userid: this.activeUser?.id });
	}

	selectUser(user: User) {
		if (this.selectedChannel)
			this.selectedChannel = undefined;
		this.selectedUser = user;
		this.messageService.changeOfDM('change of DM');
	}

	popUpNewChannel() {
		const popup = document.getElementById('popup-new-channel');
		popup?.classList.toggle('show-popup');
	}

	async createChannel() {
		if (!this.newChannelName) {
			this.newChannelNameInvalid = true;
			return;
		}
		try {
			await this.channelDataService.getChannelByName(this.newChannelName);
			this.newChannelNameInvalid = true;
			return;
		} catch (e) {
			this.socket.emit('createChannel', {
				channelname: this.newChannelName,	
				ownerid: this.activeUser?.id,
				type: this.selectedChannelType,
				password: this.setChannelPassword ? this.setChannelPassword : undefined
			});
			await this.updateChannelList();
			this.closeNewChannelPopUp();
		}
	}

	closeNewChannelPopUp() {
		this.newChannelName = undefined;
		this.newChannelNameInvalid = false;
		this.setChannelPassword = undefined;
		this.selectedChannelType = ChannelType.public;
		const popup = document.getElementById('popup-new-channel');
		popup?.classList.toggle('show-popup');
	}

	closeChannelPasswordPopUp() {
		this.enterChannelPassword = undefined;
		this.channelPasswordInvalid = false;
		this.channelToJoin = undefined;
		const popup = document.getElementById('popup-channel-password');
		popup?.classList.toggle('show-popup');
	}

	async joinChannel(channel: Channel) {
		if (channel.type == ChannelType.protected) {
			this.channelToJoin = channel;
			const popup = document.getElementById('popup-channel-password');
			popup?.classList.toggle('show-popup');
		}
		else {
			this.socket.emit('joinChannel', {
				channelid: channel.id,
				userid: this.activeUser?.id,
			});
			await this.updateChannelList();
		}
	}

	joinChannelWithPassword()  {
		//this.channelToJoin ist der betroffene channel
		//check if password is valid
		//if no: this.channelPasswordInvalid = true & return
		//if yes:
		//socket.emit('joinChannel') incl password?
		console.log("joinChannelWithPassword() called");
		this.closeChannelPasswordPopUp;
	}

	disableCreateChannelButton(): boolean {
		if (!this.newChannelName)
			return true;
		if (this.selectedChannelType == ChannelType.protected && !this.setChannelPassword) {
			return true;
		}	
		return false;
	}

	async updateChannelList() {
		await new Promise(r => setTimeout(r, 250));
		//TO-DO: update list of all visible channels
		await this.userDataService.findSelf().then(user => {
			this.activeUser = user;
			this.memberChannels = this.activeUser.channelList;
		});
	}
}
