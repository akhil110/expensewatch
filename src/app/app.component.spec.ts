import { AppComponent } from './app.component';

describe('AppComponent', () => {
	let fixture: AppComponent;
	let authServiceMock: any;

	beforeEach(() => {
		authServiceMock = {
			isLoggedIn: jest.fn()
		};
		fixture = new AppComponent(
			authServiceMock
		);
	});

	describe('Setup Component', () => {
		it ('should be initialized', () => {
			fixture.authService = authServiceMock;
			expect(fixture.currentyear).toEqual(new Date().getFullYear());
		});
	});
});
