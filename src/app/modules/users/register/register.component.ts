import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, FormBuilder, Validators, AbstractControl } from '@angular/forms';
import { Router } from '@angular/router';
import { UserService } from '../user.service';

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
	selector: 'app-register',
	templateUrl: './register.component.html',
	styleUrls: ['./register.component.css']
})
export class RegisterComponent implements OnInit {
	registerForm: FormGroup;
	constructor(
		private fb: FormBuilder,
		private userService: UserService,
		private router: Router,
	) { }

	firstname = new FormControl('', [Validators.required]);
	lastname = new FormControl('', [Validators.required]);
	email = new FormControl('', [Validators.required, Validators.email]);
	username = new FormControl('', [Validators.required, Validators.minLength(4), Validators.maxLength(16)]);
	password = new FormControl('', [Validators.required, Validators.pattern('^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9]).{6,12}$')]);
	retypepass = new FormControl('', [Validators.required]);

	ngOnInit(): void {
		this.registerForm = this.fb.group({
			firstname: this.firstname,
			lastname: this.lastname,
			email: this.email,
			username: this.username,
			passwordGroup: this.fb.group({
				password: this.password,
				retypepass: this.retypepass,
			}, {validator: comparePassword})
		});
	}

	registerUser(formdata: any): void {
		if (this.registerForm.dirty && this.registerForm.valid) {
			const theForm = this.registerForm.value;
			const thePass = this.registerForm.value.passwordGroup.password;
			theForm.password = thePass;
			delete theForm.passwordGroup;

			this.userService.register(theForm)
				.subscribe((result: any) => {
					if (result.success === false) {
						alert(result.message);
					} else {
						alert(result.message);
						this.router.navigate(['login']);
					}
					this.registerForm.reset();
			});
		}
	}

}
