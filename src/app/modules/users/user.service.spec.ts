import { of } from 'rxjs';
import { UserService } from './user.service';

describe('Service: UserService', () => {
	let service: UserService;
	const http = jest.fn();

	beforeEach(() => {
		service = new UserService(http as any);
	});

	describe('Test: buildHeader', () => {
		it('should be defined', () => {
			expect(service.buildHeader()).toBeDefined();
		});
	});

	describe('Test: jwtToken', () => {
		it('should be defined', () => {
			const objUser = {
				user: {name: test},
				token: 'faketoken'
			};
			service.jwtToken = objUser.token;
			expect(service.jwtToken).toBeDefined();
		});
	});

	describe('Test: register', () => {
		it('should register user', done => {
			const mockUser = {
				firstname: 'John',
				lastname: 'Doe',
				email: 'johndoe@email.com',
				username: 'johnd',
				password: 'test1234'
			};

			const response = {
				success: true,
				message: 'User created successfully, please login to access your account.'
			};

			const httpMock = {
				post: jest.fn().mockReturnValue(of(response))
			};
			const serviceMock = new UserService(httpMock as any);
			serviceMock.register(mockUser).subscribe((data) => {
				expect(httpMock.post).toBeDefined();
				expect(httpMock.post).toHaveBeenCalled();
				expect(data).toEqual(response);
				done();
			});
		});
	});

	describe('Test: getUser', () => {
		it('should get user details', done => {
			const response = {
				success: true,
				data: {}
			};

			const httpMock = {
				get: jest.fn().mockReturnValue(of(response))
			};
			const serviceMock = new UserService(httpMock as any);
			serviceMock.getUser('123').subscribe((data) => {
				expect(httpMock.get).toBeDefined();
				expect(httpMock.get).toHaveBeenCalled();
				expect(data).toEqual(response);
				done();
			});
		});
	});

	describe('Test: updateUser', () => {
		it('should update user', done => {
			const mockUser = {
				firstname: 'John',
				lastname: 'Doe',
				email: 'johndoe@email.com',
			};

			const response = {
				success: true,
				message: 'User details updated successfully'
			};

			const httpMock = {
				put: jest.fn().mockReturnValue(of(response))
			};
			const serviceMock = new UserService(httpMock as any);
			serviceMock.updateUser('123', mockUser).subscribe((data) => {
				expect(httpMock.put).toBeDefined();
				expect(httpMock.put).toHaveBeenCalled();
				expect(data).toEqual(response);
				done();
			});
		});
	});

	describe('Test: updatePassword', () => {
		it('should change password', done => {
			const mockForm = {
				oldpassword: 'John',
				password: 'Doe'
			};

			const response = {
				success: true,
				message: 'Password updated successfully'
			};

			const httpMock = {
				put: jest.fn().mockReturnValue(of(response))
			};
			const serviceMock = new UserService(httpMock as any);
			serviceMock.updatePassword('123', mockForm).subscribe((data) => {
				expect(httpMock.put).toBeDefined();
				expect(httpMock.put).toHaveBeenCalled();
				expect(data).toEqual(response);
				done();
			});
		});
	});

});
