import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { ReportComponent } from './report/report.component';
import { AddexpenseComponent } from './addexpense/addexpense.component';
import { ViewexpenseComponent } from './viewexpense/viewexpense.component';
import { AuthGuard } from '../../services/authguard.service';

const routes: Routes = [
	{ path: 'report', canActivate: [ AuthGuard], component: ReportComponent },
	{ path: 'addexpense', canActivate: [ AuthGuard], component: AddexpenseComponent },
	{ path: 'addexpense/:id', canActivate: [ AuthGuard], component: AddexpenseComponent },
	{ path: 'viewexpense/:id', canActivate: [ AuthGuard], component: ViewexpenseComponent },
	{ path: '', redirectTo: 'login', pathMatch: 'full' },
];

@NgModule({
	imports: [RouterModule.forChild(routes)],
	exports: [RouterModule]
})
export class ExpenseRoutingModule { }
