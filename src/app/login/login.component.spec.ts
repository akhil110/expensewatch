import { LoginComponent } from './login.component';
import { FormBuilder } from '@angular/forms';

describe('LoginComponent', () => {
	let fixture: LoginComponent;
	let authServiceMock: any;
	let formBuilderMock: FormBuilder;
	let routerMock: any;

	beforeEach(() => {
		authServiceMock = {
			login: jest.fn()
		};
		formBuilderMock = new FormBuilder();
		routerMock = jest.fn();
		fixture = new LoginComponent(
			formBuilderMock,
			authServiceMock,
			routerMock
		);
		fixture.ngOnInit();
	});

	describe('Test: ngOnInit', () => {
		it('should initialize loginForm', () => {
			const loginForm = {
				username: '',
				password: ''
			};
			expect(fixture.loginForm.value).toEqual(loginForm);
		});
	});

	describe('Test: Login Form', () => {
		it('should invalidate the form', () => {
			fixture.loginForm.controls.username.setValue('');
			fixture.loginForm.controls.password.setValue('');
			expect(fixture.loginForm.valid).toBeFalsy();
		});

		it('should validate the form', () => {
			fixture.loginForm.controls.username.setValue('demo');
			fixture.loginForm.controls.password.setValue('P@$$W0rd');
			expect(fixture.loginForm.valid).toBeTruthy();
		});
	});

	describe('Test: Form invalid', () => {
		it('should not call loginUser', () => {
			const formData = {
				username: '',
				password: ''
			};
			fixture.loginUser(formData);
			expect(authServiceMock.login).not.toHaveBeenCalled();
		});
	});

	describe('Test: Form valid', () => {
		it('should call loginUser', () => {
			const formData = {
				username: 'demo',
				password: 'pass1234'
			};
			const spyloginUser = jest.spyOn(authServiceMock, 'login').mockReturnValue(true);
			expect(authServiceMock.login(formData)).toBe(true);
			expect(spyloginUser).toHaveBeenCalledWith(formData);
		});
	});

});
