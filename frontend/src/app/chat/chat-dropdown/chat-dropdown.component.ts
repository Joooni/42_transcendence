import { Component, Input } from "@angular/core";
import { User } from "src/app/models/user";
import { UserDataService } from "src/app/services/user-data/user-data.service";
import { ChatComponent } from "../chat.component";

@Component({
	selector: 'app-chat-dropdown',
	templateUrl: './chat-dropdown.component.html',
	styleUrls: ['./chat-dropdown.component.css'] 
})
export class ChatDropdownComponent {
	@Input()
	selectedUser!: User;

	activeUser?: User;

	constructor(
		private userDataService: UserDataService,
		private chatComponent: ChatComponent
	) {}

	ngOnInit() {
		this.userDataService.findSelf().then(user => this.activeUser = user);
	}

	blocksOrIsBlockedByActiveUser(): boolean {
		//TO-DO: check if the selectedUser blocked the other user or the other way around
		//if so, return true
		return false;
	}

	openDMWithUser() {
		this.chatComponent.selectUser(this.selectedUser);
	}
}