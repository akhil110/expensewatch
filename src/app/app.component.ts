import { Component } from '@angular/core';
import { AuthService } from './services/auth.service';

@Component({
	selector: 'app-root',
	templateUrl: './app.component.html',
	styleUrls: ['./app.component.css']
})
export class AppComponent {
	currentyear: number;
	constructor(
		public authService: AuthService ) {
		this.currentyear = new Date().getFullYear();
	}
}
