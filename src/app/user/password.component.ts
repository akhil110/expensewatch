import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, FormBuilder, Validators, AbstractControl } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { ToastrService } from '../common/toastr.service'
import { UserService } from '../user/user.service';
import { AuthService } from '../user/auth.service';

function comparePassword(c: AbstractControl): {[key: string]: boolean} | null {
    let passwordControl = c.get('password');
    let confirmControl = c.get('retypepass');

    if (passwordControl.pristine || confirmControl.pristine) {
      return null;
    }

    if (passwordControl.value === confirmControl.value) {
        return null;
    }
    return { 'mismatchedPassword': true };
 }

@Component({
  templateUrl: './password.component.html'
})

export class PasswordComponent implements OnInit {

  passwordForm: FormGroup;
  userObj: any;

  constructor(private fb: FormBuilder, 
    private authService: AuthService,
    private userService: UserService,
    private router: Router,
    private toastr: ToastrService) {
  }
  
  oldpassword = new FormControl('', [Validators.required]);
  password = new FormControl('', [Validators.required, Validators.pattern('^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9]).{6,12}$')]);
  retypepass = new FormControl('', [Validators.required]);

  ngOnInit(){
    this.userObj =  this.authService.currentUser;
    this.passwordForm = this.fb.group({
      oldpassword: this.oldpassword,
      passwordGroup: this.fb.group({
        password: this.password,
        retypepass: this.retypepass,
      }, {validator: comparePassword})
    });
  }

  updatePassword(formdata:any): void {
    if (this.passwordForm.dirty && this.passwordForm.valid) {
      let theForm = this.passwordForm.value;
      const thePass = this.passwordForm.value.passwordGroup.password;
      theForm.password = thePass;
      delete theForm.passwordGroup;

      this.userService.updatePassword(this.userObj.userid,theForm)
        .subscribe(data => {
          if (data.success === false) {
            if (data.errcode){
              this.authService.logout();
              this.router.navigate(['login']);
            }
            this.toastr.error(data.message);
          } else {
            this.toastr.success(data.message);
          }
          this.passwordForm.reset();
      });
    }
  }
  
}
