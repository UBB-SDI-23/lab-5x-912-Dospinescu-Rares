import { HttpResponse } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { combineLatest, Observable } from 'rxjs';
import { ApiService } from 'src/app/common/services/api.service.service';
import { PaginationService } from 'src/app/common/services/pagination.service.service';
import { SharedDataService } from 'src/app/common/services/shared-data.service.service';
import { User } from '../models/user.models';

@Component({
  selector: 'app-users-overview',
  templateUrl: './users-overview.component.html',
  styleUrls: ['./users-overview.component.css']
})
export class UsersOverviewComponent implements OnInit {
  users: User[] = [];
  status = "processing";
  currentPage = 0;
  pageTotal = 0;
  pageSize = 20;
  pageArray: (number | string)[] = [];
  resultTotal: number = 0;

  checkboxItems: number[] = [];

  constructor(private apiSvc: ApiService, private pageSvc: PaginationService, private router: Router, private toastr: ToastrService, private sharedData: SharedDataService) {}

  ngOnInit(): void {
    if (this.sharedData.getUrlsLength() === 0) {
      var data = combineLatest([this.sharedData.currentPage$, this.sharedData.pageSize$])
        .subscribe(([currentPage, pageSize]) => {
          this.currentPage = currentPage;
          this.pageSize = pageSize;
        });
      data.unsubscribe();
    }
    this.sharedData.clear();
    this.loadUsers();
  }

  loadUsers(): void {
    this.checkboxItems = [];
    this.status = "processing";
    this.apiSvc.getUsers(this.currentPage, this.pageSize).subscribe(
      (response: HttpResponse<User[]>) => {
        this.users = response.body!;
        this.pageTotal = parseInt(response.headers.get('X-Page-Total')!, 10) - 1;
        this.resultTotal = parseInt(response.headers.get('X-Result-Total')!, 10);
        this.pageArray = this.pageSvc.generatePageArray(this.pageTotal, this.currentPage)
        this.status = "success";
      },
      error => {
        this.status = "fail";
      }
    );
  }

  goToUserDetails(userId: string) {
    this.sharedData.prepareToNavigate("/users", this.currentPage, this.pageSize)
    this.router.navigateByUrl(`/user/${userId}`);
  }

  getRole(): Observable<string> {
    return this.apiSvc.getRole();
  }

  bulkDelete() {
    this.apiSvc.bulkDelete("movie", this.checkboxItems).subscribe((result: any) => {
      this.toastr.success(result, '', {timeOut: 3000});
      this.loadUsers();
    })
  }

  checkboxChanged(item: string) {
    var itemNumber = parseInt(item, 10);
    const index = this.checkboxItems.findIndex(i => i === itemNumber);
    if (index > -1) {
      this.checkboxItems.splice(index, 1);
    } else {
      this.checkboxItems.push(itemNumber);
    }
  }

  setAllCheckboxes() {
    const bulkCheckbox = document.querySelector('input[name="bulk"]') as HTMLInputElement;
    const isChecked = bulkCheckbox.checked;

    const checkboxes = document.querySelectorAll<HTMLInputElement>('input[type="checkbox"]');
    checkboxes.forEach((checkbox: HTMLInputElement) => {
      if (checkbox.checked === !isChecked) {
        checkbox.checked = isChecked;

        const event = new Event('change', { bubbles: true});
        checkbox.dispatchEvent(event);
      }
    })
  }

  deleteUser(userId: string) {
    this.apiSvc.deleteUser(userId).subscribe((user: User) => {
      this.toastr.success(`The user was succesfully deleted!`, '', {timeOut: 3000});
      this.loadUsers();
    })
  }

  askForConfirmation(i:number, movieId: string) {
    const toastrRef = this.toastr.warning(`Click here to confirm you wish to delete the user at index ${i+1}!`, '', {
      timeOut: 5000,
      tapToDismiss: true,
      onActivateTick: true
    });
  
    toastrRef.onTap.subscribe(() => {
      this.deleteUser(movieId);
    });
  }

  switchPage(pageNumber: (number | string)) {
    this.currentPage = parseInt(pageNumber as string, 10) - 1;
    this.loadUsers();
  }
}