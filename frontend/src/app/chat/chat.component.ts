import { Component, OnInit, OnDestroy } from '@angular/core';

import { UserDataService } from '../services/user-data/user-data.service';
import { UserRelationService } from '../services/user-relation/user-relation.service';
import { ChannelDataService } from '../services/channel-data/channel-data.service';
import { User } from '../models/user';
import { Channel } from '../models/channel';
import { MessageService } from '../services/message/message.service';
// import { GameDisplayComponent } from '../game/game-display/game-display.component';
import { SocketService } from '../services/socket/socket.service';
import { Router } from '@angular/router';
import { ChatChannelComponent } from './chat-channel/chat-channel.component';
import { ErrorService } from '../services/error/error.service';

@Component({
  selector: 'app-chat',
  templateUrl: './chat.component.html',
  styleUrls: ['./chat.component.css']
})
export class ChatComponent implements OnInit, OnDestroy {
	activeUser?: User;

	friends?: User[];
	blocked?: User[];
	otherUsers?: User[];

	memberChannels?: Channel[];
	otherVisibleChannels?: Channel[];
	invitedInChannel?: Channel[];

	showFriends: boolean = true;
	showOtherUsers: boolean = false;
	showChannels: boolean = true;
	showBlocked: boolean = false;

	selectedChannel?: Channel;
	selectedUser?: User;

	hasUnreadMessages: boolean = true;

	newChannelName?: string;
	newChannelNameInvalid: boolean = false;

	selectedChannelType: string = 'public';

	setChannelPassword?: string;
	enterChannelPassword?: string;
	channelPasswordInvalid: boolean = false;

	channelToJoin?: Channel;

	constructor(
		private userDataService: UserDataService,
		private channelDataService: ChannelDataService,
		private messageService: MessageService,
		private socket: SocketService,
		private errorService: ErrorService
	) {}

	async ngOnInit(): Promise<void> {
		try {
			await this.updateUserList();
			if (this.activeUser) {
				this.channelDataService.getOtherVisibleChannels(this.activeUser.id).then(other => this.otherVisibleChannels = other);
				this.memberChannels = this.activeUser.channelList;
				this.invitedInChannel = this.activeUser.invitedInChannel;
			}
		} catch (e) {
			this.errorService.showErrorMessage('Failed to fetch Chat Data. Please refresh and try again.');
		}


		this.socket.listen('updateChannel').subscribe(() => {
			this.updateSelectedChannel();
		});
		//Will update username & status & profile picture of specific user
		this.socket.listen('updateUser').subscribe((user: any) => {
			this.updateSpecificUser(user.id, user.username, user.status, user.picture);
		});
		this.socket.listen('updateUserList').subscribe(() => {
			this.updateUserList();
		});
		this.socket.listen('updateChannelList').subscribe(() => {
			this.updateChannelList();
		});
		this.socket.listen('wrongChannelPassword').subscribe(() => {
			this.errorService.showErrorMessage("You entered the wrong channel password!")
		});
	}

	ngOnDestroy() {}

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
		try {
			const findChannel = this.memberChannels?.find(elem => elem.id === channel.id);
			if (!findChannel)
				return;
			if (this.selectedUser)
				this.selectedUser = undefined;
			await this.channelDataService.getChannel(channel.id)
				.then(rtrnChannel => this.selectedChannel = rtrnChannel)
			this.messageService.changeOfDM('change of channel');
			this.socket.emit('joinChannelRoom', { channelid: channel.id, userid: this.activeUser?.id });
		} catch (e) {
			this.errorService.showErrorMessage('Something went wrong selecting this channel. Please refresh and try again.');
		}

	}

	async updateSelectedChannel() {
		if (typeof(this.selectedChannel) == undefined || !this.selectedChannel?.id)
			return;
		const findChannel = await this.channelDataService.getChannel(this.selectedChannel.id);
		if (!findChannel)
			return;
		if (findChannel.users.find(user => user.id === this.activeUser?.id) === undefined) {
			this.selectedChannel = undefined;
			return;
		}
		this.selectedChannel = findChannel;
	}

	async updateSpecificUser(id: number, username: string, status: string, picture: string) {
		if (!id || id === this.activeUser?.id)
			return;
		
		let reference = undefined;
		let userIndex = this.otherUsers?.findIndex(elem => elem.id === id);
		if (userIndex !== -1) {
			reference = this.otherUsers;
		}
		if (reference === undefined) {
			userIndex = this.friends?.findIndex(elem => elem.id === id);
			if (userIndex !== -1) {
				reference = this.friends;
			}
		}
		if (reference === undefined) {
			userIndex = this.blocked?.findIndex(elem => elem.id === id);
			if (userIndex !== -1) {
				reference = this.blocked;
			}
		}

		if (userIndex !== -1 && reference !== undefined) {
			if (username)
				reference[userIndex!].username = username;
			if (status)
				reference[userIndex!].status = status;
			if (picture)
				reference[userIndex!].picture = picture;
		}
		else {
			this.userDataService.findUserById(id).then(dbuser => {
				this.otherUsers!.push(dbuser);
			}).catch(() => {});
		}
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
		this.selectedChannelType = 'public';
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
		try {
			const fullChannel = await this.channelDataService.getChannel(channel.id);
			if (channel.type == 'protected') {
				this.channelToJoin = channel;
				const popup = document.getElementById('popup-channel-password');
				popup?.classList.toggle('show-popup');
			} else if (fullChannel.bannedUsers.some((user) => user.id === this.activeUser?.id)) {
						this.errorService.showErrorMessage('You cannot enter this channel because you have been banned.');
			} else {
				this.socket.emit('joinChannel', {
					channelid: channel.id,
					userid: this.activeUser?.id,
				});
				await this.updateChannelList();
			}
		} catch (e) {
			this.errorService.showErrorMessage();
		}
	}

	async joinChannelWithPassword()  {
		this.socket.emit('joinChannel', {
			channelid: this.channelToJoin?.id,
			userid: this.activeUser?.id,
			password: this.enterChannelPassword,
		});
		this.closeChannelPasswordPopUp();
		await this.updateChannelList();
	}

	disableCreateChannelButton(): boolean {
		if (!this.newChannelName)
			return true;
		if (this.selectedChannelType == 'protected' && !this.setChannelPassword) {
			return true;
		}	
		return false;
	}

	async updateChannelList() {
		try {
			await new Promise(r => setTimeout(r, 250));
			await this.userDataService.findSelf().then(user => {
				this.activeUser = user;
				this.invitedInChannel = this.activeUser.invitedInChannel;
				this.memberChannels = this.activeUser.channelList;
				this.channelDataService.getOtherVisibleChannels(this.activeUser.id).then(
					other => this.otherVisibleChannels = other
				);
				if (this.selectedChannel) {
					const findChannel = this.memberChannels?.find(elem => elem.id === this.selectedChannel?.id);
					if (!findChannel)
						this.selectedChannel = undefined;
				}
			});
		} catch (e) {
			this.errorService.showErrorMessage("You have been logged out. Please refresh and/or log in again.");
		}
	}

	async updateUserList() {
		try {
			await this.userDataService.findSelf().then(user => {
				this.activeUser = user;
				if (!user) {
					return;
				}
				this.friends = user.friends.map(friend => ({...friend}));
				this.blocked = user.blockedUsers.map(blocked => ({...blocked}));
			});
			await this.userDataService.findAllExceptMyself().then(users => {
				this.otherUsers = users.filter(user => {
					return !this.friends?.some(friend => friend.id === user.id) 
						&& !this.blocked?.some(blocked => blocked.id === user.id) 
						&& !this.activeUser?.blockedFromOther.some(blocked => blocked.id === user.id);
				});
			});
	
			if (this.selectedUser) {
				const oUser = this.otherUsers?.find(user => user.id === this.selectedUser?.id);
				const fUser = this.friends?.find(user => user.id === this.selectedUser?.id);
				if (!oUser && !fUser) {
					this.selectedUser = undefined;
				}
			}
		} catch (e) {
			this.errorService.showErrorMessage("You have been logged out. Please refresh and/or log in again.");
		}
	}
}
