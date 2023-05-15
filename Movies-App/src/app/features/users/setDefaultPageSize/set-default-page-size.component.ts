import { Component, OnInit } from '@angular/core';
import { ToastrService } from 'ngx-toastr';
import { Observable } from 'rxjs';
import { ApiService } from 'src/app/common/services/api.service.service';
import { SharedDataService } from 'src/app/common/services/shared-data.service.service';

@Component({
  selector: 'app-set-default-page-size',
  templateUrl: './set-default-page-size.component.html',
  styleUrls: ['./set-default-page-size.component.css']
})
export class SetDefaultPageSizeComponent implements OnInit {
  size?: (string | number);

  constructor(private apiSvc: ApiService, private toastr: ToastrService, private sharedData: SharedDataService) {}

  ngOnInit(): void {
  }

  setSize() {
    if (this.size) {
      if (isNaN(Number(this.size))) {
        this.toastr.error('The new page size needs to be a number!', '', {timeOut: 3000});
        return;
      }
      
      this.size = parseInt(this.size as string, 10);
      if (this.size < 0) {
        this.toastr.error('The new page size cannot be a negative number!', '', {timeOut: 3000});
        return;
      }

      this.apiSvc.setPageSize(this.size).subscribe((result: any) => {
        this.toastr.success('The page size has been changed successfully!', '', {timeOut: 3000});
        this.sharedData.clear();
        this.goBack();
      },
      (err) => {
        console.log(err)
      });
    }
    else {
      this.toastr.error('All fields must be filled!', '', {timeOut: 3000});
    }
  }
 
  getRole(): Observable<string> {
    return this.apiSvc.getRole();
  }

  goBack() {
    this.sharedData.stepback();
  }
}
