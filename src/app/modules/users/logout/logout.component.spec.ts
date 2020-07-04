import { LogoutComponent } from './logout.component';

describe('LogoutComponent', () => {
	let fixture: LogoutComponent;
	let authServiceMock: any;
	let routerMock: any;

	beforeEach(() => {
		authServiceMock = {
			logout: jest.fn()
		};
		routerMock = {
			navigate: jest.fn()
		};

		fixture = new LogoutComponent(
			authServiceMock,
			routerMock
		);
		fixture.ngOnInit();
	});

	describe('Test: ngOnInit', () => {

		it('should call logout', () => {
			expect(authServiceMock.logout).toBeDefined();
		});

		it('should navigate back', () => {
			expect(routerMock.navigate).toBeDefined();
		});

	});
});
