import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, FormBuilder, Validators } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { DatePipe } from '@angular/common';
import { ExpenseService } from '../expense.service';
import { AuthService } from '../../../services/auth.service';

@Component({
	selector: 'app-addexpense',
	templateUrl: './addexpense.component.html',
	styleUrls: ['./addexpense.component.css']
})
export class AddexpenseComponent implements OnInit {
	expenseForm: FormGroup;
	userObj: any;
	acc: any = ['Food', 'Fees', 'Rent', 'Fare', 'Travel', 'Hotel', 'Phone', 'Internet', 'Repairs', 'Gas', 'Doctor', 'Books', 'Gift', 'Restaurant', 'Electricity', 'Other'];
	expid: string;
	pgTitle: string;
	btnLbl: string;
	maxDt: string;

	constructor(
		private fb: FormBuilder,
		private authService: AuthService,
		private expenseService: ExpenseService,
		private route: ActivatedRoute,
		private router: Router,
		private datePipe: DatePipe
	) { }

	expdate = new FormControl('', [Validators.required]);
	expaccount = new FormControl('', [Validators.required]);
	expamt = new FormControl('', [Validators.required, Validators.pattern('[0-9]+(\.[0-9][0-9]?)?')]);
	expdesc = new FormControl();

	ngOnInit(): void {
		this.maxDt = this.getCurrentDate();
		this.route.params.subscribe((params: any) => {
			if (params.id) {
				this.expid = params.id;
				this.getExpense(this.expid);
				this.pgTitle = 'Edit';
				this.btnLbl = 'Update';
			} else {
				this.pgTitle = 'Add';
				this.btnLbl = 'Submit';
			}
		});

		this.userObj =  this.authService.currentUser;
		this.expenseForm = this.fb.group({
			expdate: this.expdate,
			expaccount: this.expaccount,
			expamt: this.expamt,
			expdesc: this.expdesc
		});
	}

	getCurrentDate() {
		const dtToday = new Date();
		let month: any = dtToday.getMonth() + 1;
		let day: any = dtToday.getDate();
		const year = dtToday.getFullYear();
		if (month < 10) {
				month = '0' + month.toString();
		}
		if (day < 10) {
				day = '0' + day.toString();
		}
		return year + '-' + month + '-' + day;
	}

	getExpense(id: string){
		this.expenseService.getExpense(id).subscribe((data: any) => {
			if (data.success === true) {
				if (data.data[0]) {
					this.populateForm(data.data[0]);
				} else {
					alert('Expense id is incorrect in the URL');
					this.router.navigate(['report']);
				}
			}
		});
	}

	populateForm(data: any): void {
		this.expenseForm.patchValue({
			expdate: this.datePipe.transform(data.expensedate, 'y-MM-dd'),
			expaccount: data.expensetype,
			expamt: data.expenseamt,
			expdesc: data.expensedesc
		});
	}

	saveExpense(formdata: any): void {
		if (this.expenseForm.valid) {
			const theForm = this.expenseForm.value;
			if (this.expid !== '') {
				theForm.expid = this.expid;
			}

			this.expenseService.saveExpense(this.userObj.userid, theForm)
				.subscribe((data: any) => {
					if (data.success === false) {
						if (data.errcode){
							this.authService.logout();
							this.router.navigate(['login']);
						}
						alert(data.message);
					} else {
						alert(data.message);
					}
					if (!this.expid) {
						this.expenseForm.reset();
					}
			});
		}
	}

	onBack(): void {
		this.router.navigate(['/expense/report'], { preserveQueryParams: true });
	}

}
