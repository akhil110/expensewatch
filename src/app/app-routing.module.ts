import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { LoginComponent } from './login/login.component';
import { AboutComponent } from './about/about.component';

const routes: Routes = [
	{ path: 'login', component: LoginComponent },
	{ path: 'about', component: AboutComponent },
	{
		path: 'user',
		loadChildren: () => import('./modules/users/users.module').then(m => m.UsersModule)
	},
	{
		path: 'expense',
		loadChildren: () => import('./modules/expense/expense.module').then(m => m.ExpenseModule)
	},
	{ path: '', redirectTo: 'login', pathMatch: 'full' },
];

@NgModule({
	imports: [RouterModule.forRoot(routes, { useHash: true})],
	exports: [RouterModule]
})
export class AppRoutingModule { }
