import { Component, OnInit, OnDestroy } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { Subscription } from 'rxjs';
import { ExpenseService } from '../expense.service';
import { AuthService } from '../../../services/auth.service';
import { IExpense } from '../../../models/expense';

@Component({
	selector: 'app-viewexpense',
	templateUrl: './viewexpense.component.html',
	styleUrls: ['./viewexpense.component.css']
})
export class ViewexpenseComponent implements OnInit, OnDestroy {
	expense: IExpense;
	private sub: Subscription;

	constructor(
		private authService: AuthService,
		private expenseService: ExpenseService,
		private route: ActivatedRoute,
		private router: Router
	) { }

	ngOnInit(): void {
		this.sub = this.route.params.subscribe(
		params => {
			const id = params.id;
			this.getExpense(id);
		});
	}

	getExpense(id: string) {
		this.expenseService.getExpense(id).subscribe((data: any) => {
			if (data.success === false) {
				if (data.errcode){
					this.authService.logout();
					this.router.navigate(['login']);
				}
				alert(data.message);
			} else {
				if (data.data[0]) {
					this.expense = data.data[0];
				} else {
					alert('Expense id is incorrect in the URL');
				}
			}
		});
	}

	onBack(): void {
		this.router.navigate(['expense/report'], { preserveQueryParams: true });
	}

	ngOnDestroy() {
		this.sub.unsubscribe();
	}

}
