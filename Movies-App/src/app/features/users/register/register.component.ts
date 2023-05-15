import { Component, OnInit } from '@angular/core';
import { ToastrService } from 'ngx-toastr';
import { ApiService } from 'src/app/common/services/api.service.service';
import { SharedDataService } from 'src/app/common/services/shared-data.service.service';
import { UserDto } from '../models/user.models';
import { BehaviorSubject, Observable } from 'rxjs';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css']
})
export class RegisterComponent implements OnInit {
  username?: string;
  password?: string;
  email?: string;

  private codeSubject = new BehaviorSubject<string>('');

  constructor(private apiSvc: ApiService, private toastr: ToastrService, private sharedData: SharedDataService) {}

  ngOnInit(): void {
    console.log(document.cookie);
  }

  register() {
    if (this.username && this.password && this.email) {
      if (this.username.length < 12) {
        this.toastr.error('The username cannot be shorter than 12 characters!', '', {timeOut: 3000});
        return;
      }

      const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;

      if (!emailRegex.test(this.email)) {
        this.toastr.error('The email address is not valid!', '', {timeOut: 3000});
        return;
      }
      
      if (this.password.length < 8) {
        this.toastr.error('The password must be at least 8 characters long!', '', {timeOut: 3000});
        return;
      }
    
      if (!/[a-z]/.test(this.password)) {
        this.toastr.error('The password must contain at least one lowercase letter!', '', {timeOut: 3000});
        return;
      }
    
      if (!/[A-Z]/.test(this.password)) {
        this.toastr.error('The password must contain at least one uppercase letter!', '', {timeOut: 3000});
        return;
      }
    
      if (!/\d/.test(this.password)) {
        this.toastr.error('The password must contain at least one digit!', '', {timeOut: 3000});
        return;
      }
    
      if (!/[^A-Za-z0-9]/.test(this.password)) {
        this.toastr.error('The password must contain at least one special character!', '', {timeOut: 3000});
        return;
      }

      const user: UserDto = {
        username: this.username,
        email: this.email,
        password: this.password,
      }
      
      this.apiSvc.register(user).subscribe((result: any) => {
        this.toastr.success('Your account has been succesfully created!', '', {timeOut: 3000});
        this.codeSubject.next(result.confirmation_code);
      },
      (err) => {
        this.toastr.error("Something went wrong while trying to register your account!", '', {timeOut: 10000});
      });
    }
    else {
      this.toastr.error('All fields must be filled!', '', {timeOut: 3000});
    }
  }
 
  isLoggedIn(): Observable<boolean> {
    return this.apiSvc.isLoggedIn();
  }

  getCode(): Observable<string> {
    return this.codeSubject.asObservable();
  }

  goBack() {
    this.sharedData.stepback();
  }
}