import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { RouterModule} from '@angular/router';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { RegisterComponent } from './register.component';
import { ProfileComponent } from './profile.component';
import { PasswordComponent } from './password.component';
import { LogoutComponent } from './logout.component';
import { AuthGuard } from './auth-guard.service';
import { AuthService } from './auth.service';
import { UserService } from './user.service';

@NgModule({
  imports: [
    BrowserModule,
    FormsModule,
    ReactiveFormsModule,
    RouterModule.forChild([
      { path: 'register', component: RegisterComponent },
      { path: 'profile', canActivate: [ AuthGuard], component: ProfileComponent },
      { path: 'password', canActivate: [ AuthGuard], component: PasswordComponent },
      { path: 'logout', canActivate: [ AuthGuard], component: LogoutComponent }
    ])
  ],
  declarations: [
    RegisterComponent,
    ProfileComponent,
    PasswordComponent,
    LogoutComponent
  ],
  providers: [
    AuthService,
    AuthGuard,
    UserService
  ]
})
export class UserModule {}