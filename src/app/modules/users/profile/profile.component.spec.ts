import { ProfileComponent } from './profile.component';
import { FormBuilder } from '@angular/forms';
import { of } from 'rxjs';

describe('ProfileComponent', () => {
	let fixture: ProfileComponent;
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
			getUser: jest.fn().mockReturnValue(of(true)),
			updateUser: jest.fn()
		};
		formBuilderMock = new FormBuilder();
		routerMock = jest.fn();

		fixture = new ProfileComponent(
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

		it('should initialize profileForm', () => {
			const MockprofileForm = {
				firstname: '',
				lastname: '',
				email: ''
			};
			expect(fixture.profileForm.value).toEqual(MockprofileForm);
		});
	});

	describe('Test getUser', () => {
		it('should get user details', () => {
			const usrId = '123';
			const response = {
				success: true,
				data: {}
			};
			const spygetUser = jest.spyOn(UserServiceMock, 'getUser').mockReturnValue(response);
			expect(UserServiceMock.getUser(usrId)).toBe(response);
			expect(spygetUser).toHaveBeenCalledWith(usrId);
		});
	});

	describe('Test: Profile Form', () => {
		it('should invalidate the form', () => {
			fixture.profileForm.controls.firstname.setValue('');
			fixture.profileForm.controls.lastname.setValue('');
			fixture.profileForm.controls.email.setValue('');
			expect(fixture.profileForm.valid).toBeFalsy();
		});

		it('should validate the form', () => {
			fixture.profileForm.controls.firstname.setValue('test');
			fixture.profileForm.controls.lastname.setValue('test');
			fixture.profileForm.controls.email.setValue('test@email.com');
			expect(fixture.profileForm.valid).toBeTruthy();
		});
	});

	describe('Test populateForm', () => {
		it('should populate profile form', () => {
			fixture.profileForm.controls.firstname.patchValue('test');
			fixture.profileForm.controls.lastname.patchValue('test');
			fixture.profileForm.controls.email.patchValue('test@email.com');
			expect(fixture.profileForm.valid).toBeTruthy();
		});
	});

	describe('Test updateUser', () => {
		it('should update user details', () => {
			const usrId = '123';
			const profileForm = {
				firstname: 'test',
				lastname: 'test',
				email: 'test@email.com'
			};
			const response = {
				success: true,
				message: 'User details updated successfully'
			};
			const spyupdateUser = jest.spyOn(UserServiceMock, 'updateUser').mockReturnValue(response);
			expect(UserServiceMock.updateUser([usrId, profileForm])).toBe(response);
			expect(spyupdateUser).toHaveBeenCalledWith([usrId, profileForm]);
		});
	});

});
