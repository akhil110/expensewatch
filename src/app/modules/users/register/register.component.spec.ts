import { RegisterComponent } from './register.component';
import { FormBuilder } from '@angular/forms';

describe('RegisterComponent', () => {
	let fixture: RegisterComponent;
	let UserServiceMock: any;
	let formBuilderMock: FormBuilder;
	let routerMock: any;

	beforeEach(() => {
		UserServiceMock = {
			register: jest.fn()
		};
		formBuilderMock = new FormBuilder();
		routerMock = jest.fn();

		fixture = new RegisterComponent(
			formBuilderMock,
			UserServiceMock,
			routerMock
		);
		fixture.ngOnInit();
	});

	describe('Test: ngOnInit', () => {
		it('should initialize registerForm', () => {
			const MockregisterForm = {
				firstname: '',
				lastname: '',
				email: '',
				username: '',
				passwordGroup: {
					password: '',
					retypepass: ''
				}
			};
			expect(fixture.registerForm.value).toEqual(MockregisterForm);
		});
	});

	describe('Test: Register Form', () => {
		it('should invalidate the form', () => {
			fixture.registerForm.controls.firstname.setValue('');
			fixture.registerForm.controls.lastname.setValue('');
			fixture.registerForm.controls.email.setValue('');
			fixture.registerForm.controls.username.setValue('');
			fixture.registerForm.get('passwordGroup.password').setValue('');
			fixture.registerForm.get('passwordGroup.retypepass').setValue('');
			expect(fixture.registerForm.valid).toBeFalsy();
		});

		it('should validate the form', () => {
			fixture.registerForm.controls.firstname.setValue('John');
			fixture.registerForm.controls.lastname.setValue('Doe');
			fixture.registerForm.controls.email.setValue('john@email.com');
			fixture.registerForm.controls.username.setValue('johnd');
			fixture.registerForm.get('passwordGroup.password').setValue('P@55word');
			fixture.registerForm.get('passwordGroup.retypepass').setValue('P@55word');
			expect(fixture.registerForm.valid).toBeTruthy();
		});
	});

	describe('Test registerUser', () => {
		it('should register user', () => {
			const theForm = {
				firstname: 'John',
				lastname: 'Doe',
				email: 'john@email.com',
				username: 'johnd',
				password: 'P@55word',
			};
			const response = {
				success: true,
				message: 'User created successfully, please login to access your account.'
			};
			const spyregisterUser = jest.spyOn(UserServiceMock, 'register').mockReturnValue(response);
			expect(UserServiceMock.register(theForm)).toBe(response);
			expect(spyregisterUser).toHaveBeenCalledWith(theForm);
		});
	});

});
