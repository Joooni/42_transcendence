import { Component } from '@angular/core';
import { GameInviteService } from '../services/game-invite/game-invite.service';

@Component({
  selector: 'app-game-invite',
  templateUrl: './game-invite.component.html',
  styleUrls: ['./game-invite.component.css']
})
export class GameInviteComponent {
	constructor(public gameInviteService: GameInviteService) {}
}
