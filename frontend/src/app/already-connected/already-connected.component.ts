import { Component} from '@angular/core';
import { ErrorService } from '../services/error/error.service';

@Component({
  selector: 'app-already-connected',
  templateUrl: './already-connected.component.html',
  styleUrls: ['./already-connected.component.css']
})
export class AlreadyConnectedComponent {

	constructor (private errorService: ErrorService) {
		this.errorService.showErrorMessage("You tried to log in even though you were already logged in. To allow you to log in again, you have just been logged out... so feel free to try again");
	}
}

