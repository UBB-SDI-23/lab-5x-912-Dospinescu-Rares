import { Component, OnInit } from '@angular/core';
import { ToastrService } from 'ngx-toastr';
import { Observable } from 'rxjs';
import { ApiService } from 'src/app/common/services/api.service.service';
import { SharedDataService } from 'src/app/common/services/shared-data.service.service';

@Component({
  selector: 'app-register-confirm',
  templateUrl: './register-confirm.component.html',
  styleUrls: ['./register-confirm.component.css']
})
export class RegisterConfirmComponent implements OnInit {
  code?: string;

  constructor(private apiSvc: ApiService, private toastr: ToastrService, private sharedData: SharedDataService) {}

  ngOnInit(): void {
    console.log(document.cookie);
  }

  registerConfirm() {
    if (this.code) {
      if (this.code.length < 6 || this.code.length > 6) {
        this.toastr.error('The confirmation code needs to be exactly 6 characters long!', '', {timeOut: 3000});
        return;
      }

      
      this.apiSvc.registerConfirm(this.code).subscribe((result: any) => {
        this.toastr.success('Your account has been succesfully activated, you can now log in!', '', {timeOut: 3000});
        this.goBack();
      },
      (err) => {
        this.toastr.error(err.error.detail, '', {timeOut: 10000});
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
