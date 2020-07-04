import { AddexpenseComponent } from './addexpense.component';
import { FormBuilder } from '@angular/forms';
import { convertToParamMap } from '@angular/router';
import { of } from 'rxjs';

describe('AddexpenseComponent', () => {
	let fixture: AddexpenseComponent;
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
			getExpense: jest.fn(),
			saveExpense: jest.fn()
		};
		formBuilderMock = new FormBuilder();
		routerMock = {
			navigate: jest.fn()
		},
		routeMock = {
			params: of(convertToParamMap({ id: '123' }))
		};
		datepipeMock = jest.fn();

		fixture = new AddexpenseComponent(
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
		it('should get params', () => {
			expect(routeMock.params).toBeTruthy();
		});

		it('should not call getExpense', () => {
			const getExpenseSpy = jest.spyOn(fixture, 'getExpense');
			expect(getExpenseSpy).not.toHaveBeenCalled();
		});

		it('should check title & label', () => {
			expect(fixture.pgTitle).toEqual('Add');
			expect(fixture.btnLbl).toEqual('Submit');
		});

		it('should initialize expenseForm', () => {
			const expenseForm = {
				expdate: '',
				expaccount: '',
				expamt: '',
				expdesc: null
			};
			expect(fixture.expenseForm.value).toEqual(expenseForm);
		});
	});

	describe('Test: Expense Form', () => {
		it('should invalidate the form', () => {
			fixture.expenseForm.controls.expdate.setValue('');
			fixture.expenseForm.controls.expaccount.setValue('');
			fixture.expenseForm.controls.expamt.setValue('');
			fixture.expenseForm.controls.expdesc.setValue('');
			expect(fixture.expenseForm.valid).toBeFalsy();
		});

		it('should validate the form', () => {
			fixture.expenseForm.controls.expdate.setValue('01/01/2001');
			fixture.expenseForm.controls.expaccount.setValue('Fees');
			fixture.expenseForm.controls.expamt.setValue('100');
			fixture.expenseForm.controls.expdesc.setValue('Some Text');
			expect(fixture.expenseForm.valid).toBeTruthy();
		});
	});

	describe('Test getCurrentDate', () => {
		it('should return current date', () => {
			const genDate = new Date(fixture.getCurrentDate());
			const curDate = new Date();
			expect(genDate.getDate()).toEqual(curDate.getDate());
			expect(genDate.getMonth()).toEqual(curDate.getMonth());
			expect(genDate.getFullYear()).toEqual(curDate.getFullYear());
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

	describe('Test populateForm', () => {
		it('should populate expense form', () => {
			fixture.expenseForm.controls.expdate.setValue('01/01/2001');
			fixture.expenseForm.controls.expaccount.setValue('Fees');
			fixture.expenseForm.controls.expamt.setValue('100');
			fixture.expenseForm.controls.expdesc.setValue('Some Text');
			expect(fixture.expenseForm.valid).toBeTruthy();
		});
	});

	describe('Test saveExpense', () => {
		it('should save expense', () => {
			const expId = '123';
			const objExp = {
				expdate: '01/01/2001',
				expaccount: 'Fees',
				expamt: 100,
				expdesc: 'Some Text'
			};
			const response = {
				success: true,
				message: 'Expense saved successfully'
			};
			const spysaveExpense = jest.spyOn(ExpServiceMock, 'saveExpense').mockReturnValue(response);
			expect(ExpServiceMock.saveExpense([expId, objExp])).toBe(response);
			expect(spysaveExpense).toHaveBeenCalledWith([expId, objExp]);
		});
	});

	describe('Test: onBack', () => {
		it('should navigate back', () => {
			fixture.onBack();
			expect(routerMock.navigate).toHaveBeenCalledWith(['/expense/report'], { preserveQueryParams: true });
		});
	});

});
