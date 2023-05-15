import { Component, OnInit } from '@angular/core';
import { ToastrService } from 'ngx-toastr';
import { Observable } from 'rxjs';
import { ApiService } from 'src/app/common/services/api.service.service';
import { SharedDataService } from 'src/app/common/services/shared-data.service.service';

@Component({
  selector: 'app-populate-data',
  templateUrl: './populate-data.component.html',
  styleUrls: ['./populate-data.component.css']
}) 
export class PopulateDataComponent implements OnInit {
  options = ['1', '2', '3', '4', '5', '6', '7'];
  option?: (string | number);
  users?: (string | number);
  entities?: (string | number);

  constructor(private apiSvc: ApiService, private toastr: ToastrService, private sharedData: SharedDataService) {}

  ngOnInit(): void {
  }

  populateData() {
    if (this.option && this.users && this.entities) {
      if (isNaN(Number(this.users))) {
        this.toastr.error('The amount of users needs to be a number!', '', {timeOut: 3000});
        return;
      }
      
      this.users = parseInt(this.users as string, 10);
      if (this.users < 0) {
        this.toastr.error('The amount of users cannot be a negative number!', '', {timeOut: 3000});
        return;
      }

      if (isNaN(Number(this.entities))) {
        this.toastr.error('The amount of entities needs to be a number!', '', {timeOut: 3000});
        return;
      }
      
      this.entities = parseInt(this.entities as string, 10);
      if (this.entities < 0) {
        this.toastr.error('The amount of entities cannot be a negative number!', '', {timeOut: 3000});
        return;
      }

      if (!this.options.includes(this.option as string)) {
        this.toastr.error('The options needs to be one of the following: 1, 2, 3, 4, 5, 6, 7!', '', {timeOut: 3000});
        return;
      }

      this.option = parseInt(this.option as string, 10);

      this.apiSvc.populateData(this.option, this.users, this.entities).subscribe((result: any) => {
        this.toastr.success('The scripts used to generate entities has finished running!', '', {timeOut: 3000});
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
