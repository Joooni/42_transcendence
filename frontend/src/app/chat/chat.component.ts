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

	gameRequestSender?: User;
	gameRequestRecipient?: User;
	

	constructor(
		private userDataService: UserDataService,
		private userRelationService: UserRelationService,
		private channelDataService: ChannelDataService,
		private messageService: MessageService,
		private socket: SocketService,
		private router: Router,
		// private game: GameDisplayComponent,
	) {}

	async ngOnInit(): Promise<void> {

		await this.updateUserList();
		if (this.activeUser) {
			this.channelDataService.getOtherVisibleChannels(this.activeUser.id).then(other => this.otherVisibleChannels = other);
			this.memberChannels = this.activeUser.channelList;
			this.invitedInChannel = this.activeUser.invitedInChannel;
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

		this.socket.listen('gotGameRequest').subscribe((data) => {
			this.gotGameRequest(data as number)
		})
	}

	ngOnDestroy() {
		this.socket.stopListen('gotGameRequest');
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

	async updateSelectedChannel() {
		console.log('updateChannel is called');
		if (typeof(this.selectedChannel) == undefined || !this.selectedChannel?.id)
			return;
		const findChannel = await this.channelDataService.getChannel(this.selectedChannel.id);
		if (!findChannel)
			return;
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
			console.log('user will be added');
			this.userDataService.findUserById(id).then(dbuser => {
				this.otherUsers!.push(dbuser);
			});
		}
	}

	selectUser(user: User) {
		console.log(user.picture);
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
		if (channel.type == 'protected') {
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
		if (this.selectedChannelType == 'protected' && !this.setChannelPassword) {
			return true;
		}	
		return false;
	}

	async updateChannelList() {
		await new Promise(r => setTimeout(r, 250));
		//TO-DO: update list of all visible channels
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
	}

	async updateUserList() {
		await this.userDataService.findSelf().then(user => {
			this.activeUser = user;
			console.log('update UserList')
			if (!user) {
				console.log('no active user, userlist cannot be updated');
				return;
			}
			this.friends = user.friends.map(friend => ({...friend}));
			this.blocked = user.blockedUsers.concat(user.blockedFromOther).map(blocked => ({...blocked}));
		});
		await this.userDataService.findAllExceptMyself().then(users => {
			this.otherUsers = users.filter(user => {
				return !this.friends?.some(friend => friend.id === user.id) && !this.blocked?.some(blocked => blocked.id === user.id);
			});
		});

		if (this.selectedUser) {
			const oUser = this.otherUsers?.find(user => user.id === this.selectedUser?.id);
			const fUser = this.friends?.find(user => user.id === this.selectedUser?.id);
			if (!oUser && !fUser) {
				this.selectedUser = undefined;
			}
		}
	}


	popUpSendGameRequest(selectedUser: User) {
		this.gameRequestRecipient =  selectedUser;
		const popup = document.getElementById('popup-send-game-request');
		popup?.classList.toggle('show-popup');
		this.socket.emit2('sendGameRequest', this.activeUser?.id, this.gameRequestRecipient.id);
		this.socket.listen('gameRequestDecliend').subscribe((data) => {
			this.PopUpGameRequestDecliend(data as number);
		})
		this.socket.listen('gameRequestAccepted').subscribe((data) => {
			this.router.navigate(['/game']);
		})		
	}

	closePopUpSendGameRequest() {
		this.socket.emit2('gameRequestWithdrawn', this.activeUser?.id, this.gameRequestRecipient?.id);
		this.gameRequestRecipient = undefined;		
		const popup = document.getElementById('popup-send-game-request');
		popup?.classList.toggle('show-popup');
	}




	PopUpGameRequestDecliend(gameRequestRecipientID: number) {
		this.socket.stopListen('gameRequestDecliend');
		const popup = document.getElementById('popup-send-game-request');
		popup?.classList.toggle('show-popup');
		const popup2 = document.getElementById('popup-game-request-decliend');
		popup2?.classList.toggle('show-popup');
	}

	closePopUpGameRequestDecliend() {
		this.gameRequestRecipient = undefined;
		const popup = document.getElementById('popup-game-request-decliend');
		popup?.classList.toggle('show-popup');
	}


	

	async gotGameRequest(senderID: number) {
		this.gameRequestSender = await this.userDataService.findUserById(senderID);
		const popup = document.getElementById('popup-got-game-request');
		popup?.classList.toggle('show-popup');
		this.socket.listen('withdrawnGameRequest').subscribe((data) => {
			const popup = document.getElementById('popup-got-game-request');
			popup?.classList.toggle('show-popup');
			this.gameRequestSender = undefined;
			this.socket.stopListen('withdrawnGameRequest');
		})
	}
	
	closePopUpYesToGameRequest() {		
		this.socket.emit2('startGameRequest', this.activeUser?.id, this.gameRequestSender?.id)
		this.socket.stopListen('withdrawnGameRequest');
		const popup = document.getElementById('popup-got-game-request');
		popup?.classList.toggle('show-popup');
		this.gameRequestSender = undefined;
		this.router.navigate(['/game']);
	}

	closePopUpNoToGameRequest() {
		this.socket.stopListen('withdrawnGameRequest');
		this.socket.emit2('gameRequestDecliend', this.activeUser?.id, this.gameRequestSender?.id)
		const popup = document.getElementById('popup-got-game-request');
		popup?.classList.toggle('show-popup');
		this.gameRequestSender = undefined;
	}

}
