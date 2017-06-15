import { Component } from '@angular/core';
import { FormControl, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { ToastrService } from '../common/toastr.service'
import { AuthService } from '../user/auth.service';

@Component({
  templateUrl: './login.component.html'
})

export class LoginComponent {

  constructor(private fb: FormBuilder, 
    private authService: AuthService,
    private router: Router,
    private toastr: ToastrService) {
  }

  username = new FormControl('', [Validators.required]);
  password = new FormControl('', [Validators.required]);

  loginForm: FormGroup = this.fb.group({
    username: this.username,
    password: this.password,
  });


  loginUser(formdata:any): void {
    if (this.loginForm.dirty && this.loginForm.valid) {
      this.authService.login(this.loginForm.value)
        .subscribe(data => {
          if (data.json().success === false) {
            this.toastr.error(data.json().message);
          } else {
            this.toastr.success('Login successful.');
            this.router.navigate(['report']);
          }
          this.loginForm.reset();
        });
    }
  }
  
}
