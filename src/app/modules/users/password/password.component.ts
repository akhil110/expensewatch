import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, FormBuilder, Validators, AbstractControl } from '@angular/forms';
import { Router } from '@angular/router';
import { UserService } from '../user.service';
import { AuthService } from '../../../services/auth.service';

function comparePassword(c: AbstractControl): {[key: string]: boolean} | null {
	const passwordControl = c.get('password');
	const confirmControl = c.get('retypepass');

	if (passwordControl.pristine || confirmControl.pristine) {
		return null;
	}

	if (passwordControl.value === confirmControl.value) {
		return null;
	}
	return { mismatchedPassword: true };
}

@Component({
	selector: 'app-password',
	templateUrl: './password.component.html',
	styleUrls: ['./password.component.css']
})
export class PasswordComponent implements OnInit {
	passwordForm: FormGroup;
	userObj: any;

	constructor(
		private fb: FormBuilder,
		private router: Router,
		private authService: AuthService,
		private userService: UserService
	) { }

	oldpassword = new FormControl('', [Validators.required]);
	password = new FormControl('', [Validators.required, Validators.pattern('^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9]).{6,12}$')]);
	retypepass = new FormControl('', [Validators.required]);

	ngOnInit(): void {
		this.userObj =  this.authService.currentUser;
		this.passwordForm = this.fb.group({
			oldpassword: this.oldpassword,
			passwordGroup: this.fb.group({
				password: this.password,
				retypepass: this.retypepass,
			}, {validator: comparePassword})
		});
	}

	updatePassword(formdata: any): void {
		if (this.passwordForm.dirty && this.passwordForm.valid) {
			const theForm = this.passwordForm.value;
			const thePass = this.passwordForm.value.passwordGroup.password;
			theForm.password = thePass;
			delete theForm.passwordGroup;

			this.userService.updatePassword(this.userObj.userid, theForm)
			.subscribe((data: any) => {
				if (data.success === false) {
					if (data.errcode){
						this.authService.logout();
						this.router.navigate(['login']);
					}
					alert(data.message);
				} else {
					alert(data.message);
				}
				this.passwordForm.reset();
			});
		}
	}

}
