import { NgModule } from '@angular/core';
import { CommonModule, DatePipe } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ExpenseRoutingModule } from './expense-routing.module';
import { ReportComponent } from './report/report.component';
import { ViewexpenseComponent } from './viewexpense/viewexpense.component';
import { AddexpenseComponent } from './addexpense/addexpense.component';
import { AuthGuard } from '../../services/authguard.service';

@NgModule({
	declarations: [
		ReportComponent,
		ViewexpenseComponent,
		AddexpenseComponent
	],
	imports: [
		CommonModule,
		FormsModule,
		ReactiveFormsModule,
		ExpenseRoutingModule
	],
	providers: [
		DatePipe,
		AuthGuard
	]
})
export class ExpenseModule { }
