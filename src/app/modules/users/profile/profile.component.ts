import { Component, OnInit } from '@angular/core';
import { FormControl, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { UserService } from '../user.service';
import { AuthService } from '../../../services/auth.service';
import { IUser } from '../../../models/users';

@Component({
	selector: 'app-profile',
	templateUrl: './profile.component.html',
	styleUrls: ['./profile.component.css']
})
export class ProfileComponent implements OnInit {
	profileForm: FormGroup;
	userObj: any;
	user: IUser;

	constructor(
		private fb: FormBuilder,
		private authService: AuthService,
		private userService: UserService,
		private router: Router
	) { }

	firstname = new FormControl('', [Validators.required]);
	lastname = new FormControl('', [Validators.required]);
	email = new FormControl('', [Validators.email]);

	ngOnInit(): void {
		this.userObj =  this.authService.currentUser;
		this.profileForm = this.fb.group({
			firstname: this.firstname,
			lastname: this.lastname,
			email: this.email
		});

		this.getUser(this.userObj.userid);
	}

	getUser(id: string): void {
		this.userService.getUser(id).subscribe((data: any) => {
			if (data.success === false) {
				if (data.errcode){
					this.authService.logout();
					this.router.navigate(['login']);
				}
				alert(data.message);
			} else {
				this.user = data.data[0];
				this.populateForm(this.user);
			}
		});
	}

	populateForm(data: any): void {
		this.profileForm.patchValue({
			firstname: data.firstname,
			lastname: data.lastname,
			email: data.email,
		});
	}

	resetForm() {
		this.populateForm(this.user);
	}

	updateUser(formdata: any): void {
		if (this.profileForm.dirty && this.profileForm.valid) {
			this.userService.updateUser(this.userObj.userid, this.profileForm.value)
				.subscribe((data: any) => {
					if (data.success === false) {
						if (data.errcode){
							this.authService.logout();
							this.router.navigate(['login']);
						}
						alert(data.message);
					} else {
						alert(data.message);
						const theUser: any = JSON.parse(localStorage.getItem('currentUser'));
						theUser.user.firstname = this.profileForm.value.firstname;
						localStorage.setItem('currentUser', JSON.stringify(theUser));
					}
			});
		}
	}

}
