import { Component, OnInit } from '@angular/core';
import { FormControl, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router, ActivatedRoute, Params } from '@angular/router';
import { DatePipe } from '@angular/common';
import { ExpenseService } from '../expense.service';
import { AuthService } from '../../../services/auth.service';
import { IExpense } from '../../../models/expense';

@Component({
	selector: 'app-report',
	templateUrl: './report.component.html',
	styleUrls: ['./report.component.css']
})
export class ReportComponent implements OnInit {
	reportForm: FormGroup;
	userObj: any;
	reportTitle: string;
	expenses: IExpense[];
	totalrows: number;
	pgCounter: number;
	qreport: string;
	qstartdt: string;
	qenddt: string;
	qpage: number;
	qsort: string;
	dtSortIco = 'sort';
	acSortIco = 'sort';
	amSortIco = 'sort';
	exptotal: any;
	formData: any;

	constructor(
		private fb: FormBuilder,
		private authService: AuthService,
		private expenseService: ExpenseService,
		private route: ActivatedRoute,
		private router: Router,
		private datePipe: DatePipe
	) { }

	report = new FormControl('opt1');
	startdt = new FormControl({value: '', disabled: true});
	enddt = new FormControl({value: '', disabled: true});

	ngOnInit(): void {
		this.userObj =  this.authService.currentUser;
		this.reportForm = this.fb.group({
			report: this.report,
			startdt: this.startdt,
			enddt: this.enddt
		});

		this.route.queryParams.forEach((params: Params) => {
			this.qreport = params.report || '';
			this.qstartdt = params.startdt || '';
			this.qenddt = params.enddt || '';
			this.qpage = params.page || '';
			this.qsort = params.sortby || '';

			if (this.qreport !== '') {
				const payload: any = {};
				payload.report = this.qreport;
				if ( (this.qstartdt !== '' && this.qenddt !== '')){
					payload.startdt = this.qstartdt;
					payload.enddt = this.qenddt;

					this.reportForm.get('startdt').enable();
					this.reportForm.get('enddt').enable();
				}
				payload.page = this.qpage;
				payload.sortby = this.qsort;
				this.fetchReport(this.userObj.userid, payload);

				this.reportForm.patchValue({
					report: this.qreport,
					startdt: this.qstartdt,
					enddt: this.qenddt
				});
			}
		});

		this.reportForm.get('report').valueChanges
			.subscribe(value => this.toggleDates(value));
	}

	toggleDates(opt: string): void {
		const dt1Control = this.reportForm.get('startdt');
		const dt2Control = this.reportForm.get('enddt');
		if (opt === 'opt2') {
			dt1Control.setValidators(Validators.required);
			dt2Control.setValidators(Validators.required);
			dt1Control.enable();
			dt2Control.enable();
		} else {
			dt1Control.clearValidators();
			dt2Control.clearValidators();
			dt1Control.disable();
			dt2Control.disable();
			dt1Control.setValue('');
			dt2Control.setValue('');
		}
		dt1Control.updateValueAndValidity();
		dt2Control.updateValueAndValidity();
	}

	getReport(formdata: any): void {
		if (this.reportForm.valid) {
			if (this.reportForm.value.report === 'opt2' && (new Date(this.reportForm.value.startdt) > new Date(this.reportForm.value.enddt))){
				alert('Start date cannot be greater than end date.');
			} else {
				this.formData = this.reportForm.value;
				this.fetchReport(this.userObj.userid, this.formData);
			}
		}
	}

	fetchReport(userid: string, formval: any) {
		this.expenseService.getExpenses(userid, formval)
		.subscribe((data: any) => {
			if (data.success === false) {
				if (data.errcode){
					this.authService.logout();
					this.router.navigate(['login']);
				}
				alert(data.message);
			} else {
				this.expenses = data.data.docs;
				this.totalrows = +data.data.total;
				this.pgCounter = Math.floor((this.totalrows + 10 - 1) / 10);

				this.qreport = formval.report;
				if (formval.startdt){
					this.qstartdt = formval.startdt;
					this.qenddt = formval.enddt;
				}

				this.getExpTot(userid, formval);

				if (formval.report === 'opt1') {
					this.reportTitle = 'for ' + this.datePipe.transform(new Date(), 'MMM y');
				} else if (formval.report === 'opt2') {
						this.reportTitle = 'between ' + this.datePipe.transform(new Date(formval.startdt), 'd MMM y');
						this.reportTitle += ' and ' + this.datePipe.transform(new Date(formval.enddt), 'd MMM y');
				} else {
					this.reportTitle = 'till date';
				}
			}
		});
	}

	getExpTot(userid: string, formval: any) {
		this.expenseService.getExpenseTotal(userid, formval)
		.subscribe((res: any) => {
			this.exptotal = res.data[0];
		});
	}

	setPage(page: any): void {
		this.router.navigate(['expense/report'],
			{
				queryParams: { report: this.qreport, startdt: this.qstartdt, enddt: this.qenddt, page, sortby: this.qsort }
			}
		);
	}

	createPager(num: number) {
		const items: number[] = [];
		for (let i = 1; i <= num; i++){
			items.push(i);
		}
		return items;
	}

	showExpense(expid: string): void {
		this.router.navigate([`expense/viewexpense/${expid}`],
			{
				queryParams: {
					report: this.qreport,
					startdt: this.qstartdt,
					enddt: this.qenddt,
					page: this.qpage || 1,
					sortby: this.qsort
				}
			}
		);
	}

	confirmDel(idx: number, expid: string) {
		if (confirm('Do you really want to delete this record?')){
			this.expenseService.delExpense(expid)
			.subscribe((data: any) => {
				if (data.success === false) {
					if (data.errcode){
						this.authService.logout();
						this.router.navigate(['login']);
					}
					alert(data.message);
				} else {
					this.expenses.splice(idx, 1);
					this.getExpTot(this.userObj.userid, this.formData);
					alert(data.message);
				}
			});
		}
	}

	editExpense(expid: string): void {
		this.router.navigate([`expense/addexpense/${expid}`],
			{
				queryParams: {
					report: this.qreport,
					startdt: this.qstartdt,
					enddt: this.qenddt,
					page: this.qpage || 1,
					sortby: this.qsort
				}
			}
		);
	}

	sortExpense(sortby: string): void {
		this.dtSortIco = 'sort';
		this.acSortIco = 'sort';
		this.amSortIco = 'sort';

		if (this.qsort === '') {
			this.qsort = sortby;
		} else if (this.qsort.indexOf('-') > -1 ) {
			this.qsort = sortby;
			switch (sortby) {
				case 'expensedate': {
					this.dtSortIco = 'sort-up';
					break;
				}
				case 'expensetype': {
					this.acSortIco = 'sort-up';
					break;
				}
				case 'expenseamt': {
					this.amSortIco = 'sort-up';
					break;
				}
			}
		} else {
			this.qsort = '-' + sortby;
			switch (sortby) {
				case 'expensedate': {
					this.dtSortIco = 'sort-down';
					break;
				}
				case 'expensetype': {
					this.acSortIco = 'sort-down';
					break;
				}
				case 'expenseamt': {
					this.amSortIco = 'sort-down';
					break;
				}
			}
		}

		this.router.navigate(['expense/report'],
		{
			queryParams: {
				report: this.qreport,
				startdt: this.qstartdt,
				enddt: this.qenddt,
				page: this.qpage || 1,
				sortby: this.qsort
			}
		});
	}

}
