import { Component, OnInit } from '@angular/core';

import { UserDataService } from '../services/user-data.service';
import { UserRelationService } from '../services/user-relation.service';
import { ChannelDataService } from '../services/channel-data.service';
import { User } from '../objects/user';

@Component({
  selector: 'app-chat',
  templateUrl: './chat.component.html',
  styleUrls: ['./chat.component.css']
})
export class ChatComponent implements OnInit {

	friends?: string[];
	blocked?: string[];
	allUsers?: User[];

	memberChannels?: string

	showFriends: boolean = true;
	showOtherUsers: boolean = false;
	showChannels: boolean = true;

	constructor(
	private UserDataService: UserDataService,
	private UserRelationService: UserRelationService,
	private ChannelDataService: ChannelDataService
	) {}

	ngOnInit(): void {
		
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
}
