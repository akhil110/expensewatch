import { ViewexpenseComponent } from './viewexpense.component';
import { Params, convertToParamMap } from '@angular/router';
import { Subscription, of } from 'rxjs';

describe('ViewexpenseComponent', () => {
	let fixture: ViewexpenseComponent;
	let authServiceMock: any;
	let ExpServiceMock: any;
	let routerMock: any;
	let routeMock: any;
	let SubscriptionMock: Subscription;

	beforeEach(() => {
		authServiceMock = {
			logout: jest.fn()
		};
		ExpServiceMock = {
			getExpense: jest.fn()
		};
		routerMock = {
			navigate: jest.fn()
		},
		routeMock = {
			params: of(convertToParamMap({ id: '123' }))
		};
		SubscriptionMock = new Subscription();

		fixture = new ViewexpenseComponent(
			authServiceMock,
			ExpServiceMock,
			routeMock,
			routerMock
		);
		fixture.ngOnInit();
	});

	describe('Test: ngOnInit', () => {
		it('should get params', () => {
			expect(routeMock.params).toBeTruthy();
		});

		it('should call getExpense', () => {
			const getExpenseSpy = jest.spyOn(fixture, 'getExpense');
			expect(getExpenseSpy).not.toHaveBeenCalled();
		});
	});

	describe('Test getExpense', () => {
		it('should get expense', () => {
			const expId = '123';
			const response = {
				success: true,
				data: {}
			};
			const spygetExpense = jest.spyOn(ExpServiceMock, 'getExpense').mockReturnValue(response);
			expect(ExpServiceMock.getExpense(expId)).toBe(response);
			expect(spygetExpense).toHaveBeenCalledWith(expId);
		});
	});

	describe('Test onBack', () => {
		it('should navigate back', () => {
			fixture.onBack();
			expect(routerMock.navigate).toHaveBeenCalledWith(['expense/report'], { preserveQueryParams: true });
		});
	});

	describe('Test ngOnDestroy', () => {
		it('should unsubscribe', () => {
			fixture.ngOnDestroy();
			const spyunsubscribe = jest.spyOn(SubscriptionMock, 'unsubscribe');
			expect(spyunsubscribe).toBeDefined();
		});
	});

});
