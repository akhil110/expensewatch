import { Component } from '@angular/core'

import { AuthService } from './user/auth.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html'
})

export class AppComponent {
  constructor( public authService: AuthService, ) {
    
  }
}
