import { Component, OnInit } from '@angular/core';
import { User } from '../models/user.models';
import { ToastrService } from 'ngx-toastr';
import { ApiService } from 'src/app/common/services/api.service.service';
import { SharedDataService } from 'src/app/common/services/shared-data.service.service';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {
  username?: string;
  password?: string;

  constructor(private apiSvc: ApiService, private toastr: ToastrService, private sharedData: SharedDataService) {}

  ngOnInit(): void {
    console.log(document.cookie);
  }

  logIn() {
    if (this.username && this.password) {
      if (this.username.length < 12) {
        this.toastr.error('The username cannot be shorter than 12 characters!', '', {timeOut: 3000});
        return;
      }
      
      if (this.password.length < 8) {
        this.toastr.error('Password must be at least 8 characters long!', '', {timeOut: 3000});
        return;
      }
    
      if (!/[a-z]/.test(this.password)) {
        this.toastr.error('Password must contain at least one lowercase letter!', '', {timeOut: 3000});
        return;
      }
    
      if (!/[A-Z]/.test(this.password)) {
        this.toastr.error('Password must contain at least one uppercase letter!', '', {timeOut: 3000});
        return;
      }
    
      if (!/\d/.test(this.password)) {
        this.toastr.error('Password must contain at least one digit!', '', {timeOut: 3000});
        return;
      }
    
      if (!/[^A-Za-z0-9]/.test(this.password)) {
        this.toastr.error('Password must contain at least one special character!', '', {timeOut: 3000});
        return;
      }
      
      this.apiSvc.logIn(this.username, this.password).subscribe((result: any) => {
        this.toastr.success('You have been succesfully logged in!', '', {timeOut: 3000});
        this.apiSvc.fill(this.username!, result.role, result.id)
        this.goBack();
      },
      (err) => {
        this.toastr.error("Something went wrong while trying to log in!", '', {timeOut: 10000});
      });
    }
    else {
      this.toastr.error('All fields must be filled!', '', {timeOut: 3000});
    }
  }

  isLoggedIn(): Observable<boolean> {
    return this.apiSvc.isLoggedIn();
  }
 
  goBack() {
    this.sharedData.stepback();
  }
}