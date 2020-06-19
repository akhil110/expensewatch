import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { ProfileComponent } from './profile/profile.component';
import { PasswordComponent } from './password/password.component';
import { RegisterComponent } from './register/register.component';
import { LogoutComponent } from './logout/logout.component';
import { AuthGuard } from '../../services/authguard.service';

const routes: Routes = [
	{ path: 'profile', canActivate: [ AuthGuard], component: ProfileComponent },
	{ path: 'password', canActivate: [ AuthGuard], component: PasswordComponent },
	{ path: 'register', component: RegisterComponent },
	{ path: 'logout', canActivate: [ AuthGuard], component: LogoutComponent },
	{ path: '', redirectTo: 'login', pathMatch: 'full' },
];

@NgModule({
	imports: [RouterModule.forChild(routes)],
	exports: [RouterModule],
})
export class UsersRoutingModule { }
