import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { UsersRoutingModule } from './users-routing.module';
import { ProfileComponent } from './profile/profile.component';
import { PasswordComponent } from './password/password.component';
import { RegisterComponent } from './register/register.component';
import { LogoutComponent } from './logout/logout.component';
import { UserService } from './user.service';
import { AuthGuard } from '../../services/authguard.service';

@NgModule({
	declarations: [
		ProfileComponent,
		PasswordComponent,
		RegisterComponent,
		LogoutComponent
	],
	imports: [
		CommonModule,
		FormsModule,
		ReactiveFormsModule,
		UsersRoutingModule
	],
	providers: [
		UserService,
		AuthGuard
	]
})
export class UsersModule { }
