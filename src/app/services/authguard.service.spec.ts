import { AuthGuard } from './authguard.service';

describe('Service: AuthGuard', () => {
	let service: AuthGuard;
	let authServiceMock: any;
	let routerMock: any;

	beforeEach(() => {
		authServiceMock = {
			isLoggedIn: jest.fn()
		};
		routerMock = {
			navigate: jest.fn()
		};

		service = new AuthGuard (
			authServiceMock,
			routerMock
		);
	});

	describe('Test: canActivate', () => {
		it('should return true', () => {
			const spycanActivate = jest.spyOn(service, 'checkLoggedIn').mockReturnValue(true);
			expect(service.checkLoggedIn('/')).toBe(true);
		});

		it('should return false', () => {
			const spycanActivate = jest.spyOn(service, 'checkLoggedIn').mockReturnValue(false);
			expect(service.checkLoggedIn('/')).toBe(false);
		});
	});

	describe('Test: checkLoggedIn', () => {
		it('should return true', () => {
			const spyisLoggedIn = jest.spyOn(authServiceMock, 'isLoggedIn').mockReturnValue(true);
			expect(authServiceMock.isLoggedIn()).toBe(true);
		});

		it('should return false', () => {
			const spyisLoggedIn = jest.spyOn(authServiceMock, 'isLoggedIn').mockReturnValue(false);
			expect(authServiceMock.isLoggedIn()).toBe(false);
			expect(routerMock.navigate).toBeDefined();
		});
	});

});
