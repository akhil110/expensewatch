import { PasswordComponent } from './password.component';
import { FormBuilder } from '@angular/forms';

describe('PasswordComponent', () => {
	let fixture: PasswordComponent;
	let authServiceMock: any;
	let UserServiceMock: any;
	let formBuilderMock: FormBuilder;
	let routerMock: any;

	beforeEach(() => {
		authServiceMock = {
			currentUser: jest.fn(),
			logout: jest.fn()
		};
		UserServiceMock = {
			updatePassword: jest.fn()
		};
		formBuilderMock = new FormBuilder();
		routerMock = jest.fn();

		fixture = new PasswordComponent(
			formBuilderMock,
			authServiceMock,
			UserServiceMock,
			routerMock
		);
		fixture.ngOnInit();
	});

	describe('Test: ngOnInit', () => {
		it('should initialize currentuser', () => {
			fixture.userObj = authServiceMock.currentUser;
			expect(fixture.userObj).toBeDefined();
		});

		it('should initialize passwordForm', () => {
			const MockpasswordForm = {
				oldpassword: '',
				passwordGroup: {
					password: '',
					retypepass: ''
				}
			};
			expect(fixture.passwordForm.value).toEqual(MockpasswordForm);
		});
	});

	describe('Test: Password Form', () => {
		it('should invalidate the form', () => {
			fixture.passwordForm.controls.oldpassword.setValue('');
			fixture.passwordForm.get('passwordGroup.password').setValue('');
			fixture.passwordForm.get('passwordGroup.retypepass').setValue('');
			expect(fixture.passwordForm.valid).toBeFalsy();
		});

		it('should validate the form', () => {
			fixture.passwordForm.controls.oldpassword.setValue('demp');
			fixture.passwordForm.get('passwordGroup.password').setValue('P@55word');
			fixture.passwordForm.get('passwordGroup.retypepass').setValue('P@55word');
			expect(fixture.passwordForm.valid).toBeTruthy();
		});
	});

	describe('Test updatePassword', () => {
		it('should change password', () => {
			const expId = '123';
			const pwdForm = {
				oldpassword: 'demopass',
				password: 'newpass',
			};
			const response = {
				success: true,
				message: 'Password updated successfully'
			};
			const spyupdatePassword = jest.spyOn(UserServiceMock, 'updatePassword').mockReturnValue(response);
			expect(UserServiceMock.updatePassword([expId, pwdForm])).toBe(response);
			expect(spyupdatePassword).toHaveBeenCalledWith([expId, pwdForm]);
		});
	});

});
