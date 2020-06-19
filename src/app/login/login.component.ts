import { Component, OnInit } from '@angular/core';
import { FormControl, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../services/auth.service';

@Component({
	selector: 'app-login',
	templateUrl: './login.component.html',
	styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {
	loginForm: FormGroup;
	constructor(
		private fb: FormBuilder,
		private authService: AuthService,
		private router: Router,
	) { }

	username = new FormControl('', [Validators.required]);
	password = new FormControl('', [Validators.required]);

	ngOnInit(): void {
		this.loginForm = this.fb.group({
			username: this.username,
			password: this.password,
		});
	}

	loginUser(formdata: any): void {
		if (this.loginForm.dirty && this.loginForm.valid) {
			this.authService.login(this.loginForm.value)
				.subscribe(data => {
					if (data.success === false) {
						alert(data.message);
					} else {
						alert('Login successful.');
						this.router.navigate(['/expense/report']);
					}
					this.loginForm.reset();
				});
		}
	}

}
