import { Component } from '@angular/core';

@Component({
  selector: 'app-chat',
  templateUrl: './chat.component.html',
  styleUrls: ['./chat.component.css']
})
export class ChatComponent {
  
  showFriends: boolean = true;
  showOtherUsers: boolean = false;
  showChannels: boolean = true;

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
