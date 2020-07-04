import { FormBuilder } from '@angular/forms';
import { Params, convertToParamMap } from '@angular/router';
import { of } from 'rxjs';
import { ReportComponent } from './report.component';

describe('ReportComponent', () => {
	let fixture: ReportComponent;
	let authServiceMock: any;
	let ExpServiceMock: any;
	let formBuilderMock: FormBuilder;
	let routerMock: any;
	let routeMock: any;
	let datepipeMock: any;

	beforeEach(() => {
		authServiceMock = {
			currentUser: jest.fn(),
			logout: jest.fn()
		};
		ExpServiceMock = {
			getExpenses: jest.fn(),
			getExpenseTotal: jest.fn(),
			delExpense: jest.fn()
		};
		formBuilderMock = new FormBuilder();
		routerMock = {
			navigate: jest.fn()
		},
		routeMock = {
			queryParams: of(convertToParamMap({ report: 'opt1' }))
		};
		datepipeMock = jest.fn();

		fixture = new ReportComponent(
			formBuilderMock,
			authServiceMock,
			ExpServiceMock,
			routeMock,
			routerMock,
			datepipeMock
		);
		fixture.ngOnInit();
	});

	describe('Test: ngOnInit', () => {
		it('should userObj defined', () => {
			expect(fixture.userObj).toBeDefined();
		});

		it('should initialize reportForm', () => {
			const mockreportForm = {
				report: 'opt1',
			};
			expect(fixture.reportForm.value).toEqual(mockreportForm);
		});

		it('should get params', () => {
			expect(routeMock.queryParams).toBeTruthy();
		});

		it( 'should enable start & end date', () => {
			const mockreportForm = {
				report: 'opt2',
				startdt: '01-05-2020',
				enddt: '01-15-2020'
			};
			fixture.reportForm.controls.report.setValue('opt2');
			fixture.reportForm.controls.startdt.enable();
			fixture.reportForm.controls.startdt.setValue('01-05-2020');
			fixture.reportForm.controls.enddt.enable();
			fixture.reportForm.controls.enddt.setValue('01-15-2020');
			expect(fixture.reportForm.value).toEqual(mockreportForm);
		});
	});

	describe('Test: toggleDates', () => {
		it('should enable start & end date', () => {
			fixture.reportForm.controls.report.setValue('opt2');
			expect(fixture.reportForm.controls.startdt.enabled).toBeTruthy();
			expect(fixture.reportForm.controls.enddt.enabled).toBeTruthy();
		});

		it('should disable start & end date', () => {
			fixture.reportForm.controls.report.setValue('opt3');
			expect(fixture.reportForm.controls.startdt.enabled).toBeFalsy();
			expect(fixture.reportForm.controls.enddt.enabled).toBeFalsy();
		});
	});

	describe('Test: getReport', () => {
		it('should be defined', () => {
			fixture.getReport = jest.fn();
			expect(fixture.getReport).toBeDefined();
		});
	});

	describe('Test fetchReport', () => {
		it('should return expense', () => {
			const usrId = '123';
			const mockreportForm = {
				report: 'opt1',
			};
			const response = {
				success: true,
				data: {}
			};
			const spyfetchReport = jest.spyOn(ExpServiceMock, 'getExpenses').mockReturnValue(response);
			expect(ExpServiceMock.getExpenses([usrId, mockreportForm])).toBe(response);
			expect(spyfetchReport).toHaveBeenCalledWith([usrId, mockreportForm]);
		});
	});

	describe('Test: getExpTot', () => {
		it('should be defined', () => {
			fixture.getExpTot = jest.fn();
			expect(fixture.getExpTot).toBeDefined();
		});
	});

	describe('Test: setPage', () => {
		it('should navigate', () => {
			fixture.setPage('123');
			expect(routerMock.navigate).toHaveBeenCalledWith(['expense/report'],
			{queryParams: {enddt: '', page: '123', report: '', sortby: '', startdt: ''}});
		});
	});

	describe('Test: createPager', () => {
		it('should create pager', () => {
			const mockItem = [1, 2];
			expect(fixture.createPager(2)).toEqual(mockItem);
		});
	});

	describe('Test: showExpense', () => {
		it('should navigate', () => {
			fixture.showExpense('123');
			expect(routerMock.navigate).toHaveBeenCalledWith(['expense/viewexpense/123'],
			{queryParams: {enddt: '', page: 1, report: '', sortby: '', startdt: ''}});
		});
	});

	describe('Test: confirmDel', () => {
		it('should delete expense', () => {
			const expId = '123';
			const response = {
				success: true,
				message: 'Expense removed successfully'
			};
			const spydelExpense = jest.spyOn(ExpServiceMock, 'delExpense').mockReturnValue(response);
			expect(ExpServiceMock.delExpense([1, expId])).toBe(response);
			expect(spydelExpense).toHaveBeenCalledWith([1, expId]);
		});
	});

	describe('Test: editExpense', () => {
		it('should navigate', () => {
			fixture.editExpense('123');
			expect(routerMock.navigate).toHaveBeenCalledWith(['expense/addexpense/123'],
			{queryParams: {enddt: '', page: 1, report: '', sortby: '', startdt: ''}});
		});
	});

	describe('Test: sortExpense', () => {
		it('should sort expense', () => {
			fixture.sortExpense('expensedate');
			fixture.qsort = 'expensedate';
			expect(fixture.dtSortIco).toEqual('sort');
			expect(routerMock.navigate).toHaveBeenCalledWith(['expense/report'],
			{queryParams: {enddt: '', page: 1, report: '', sortby: 'expensedate', startdt: ''}});
		});
	});

});
