import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../../../services/auth.service';

@Component({
	selector: 'app-logout',
	templateUrl: './logout.component.html',
	styleUrls: ['./logout.component.css']
})
export class LogoutComponent implements OnInit {

	constructor(
		private authService: AuthService,
		private router: Router,
	) { }

	ngOnInit(): void {
		setTimeout(() => {
			this.authService.logout();
			alert('You have been logged out.');
			this.router.navigate(['login']);
		});
	}

}
