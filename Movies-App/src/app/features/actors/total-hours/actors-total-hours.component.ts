import { Component, OnInit } from '@angular/core';
import { Actor, ActorWithHours } from '../models/actors.models';
import { ApiService } from 'src/app/common/services/api.service.service';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { HttpResponse } from '@angular/common/http';
import { PaginationService } from 'src/app/common/services/pagination.service.service';
import { SharedDataService } from 'src/app/common/services/shared-data.service.service';
import { Observable, combineLatest } from 'rxjs';

@Component({
  selector: 'app-actors-total-hours',
  templateUrl: './actors-total-hours.component.html',
  styleUrls: ['./actors-total-hours.component.css']
})
export class ActorsTotalHoursComponent implements OnInit{
  actors: ActorWithHours[] = [];
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
    this.loadActors();
  }

  loadActors(): void {
    this.checkboxItems = [];
    this.status = "processing";
    this.apiSvc.getActorsByHours(this.currentPage, this.pageSize).subscribe(
      (response: HttpResponse<ActorWithHours[]>) => {
        this.actors = response.body!;
        this.pageTotal = parseInt(response.headers.get('X-Page-Total')!, 10) - 1;
        this.resultTotal = parseInt(response.headers.get('X-Result-Total')!, 10);
        this.pageArray = this.pageSvc.generatePageArray(this.pageTotal, this.currentPage)
        this.status = "success";
      },
      error => {
        console.error(error);
        this.status = "fail";
      }
    );
  }

  goToActorDetails(actorId: string) {
    this.sharedData.prepareToNavigate("/actors/hours", this.currentPage, this.pageSize)
    this.router.navigateByUrl(`/actors/${actorId}`)
  }

  goToUserDetails(userId: string) {
    this.sharedData.prepareToNavigate("/actors/hours", this.currentPage, this.pageSize)
    this.router.navigateByUrl(`/user/profile/${userId}`);
  }

  deleteActor(actorId: string) {
    this.apiSvc.deleteActor(actorId).subscribe((actor: Actor) => {
      this.toastr.success(`The actor was succesfully deleted!`, '', {timeOut: 3000});
      this.loadActors();
    })
  }

  hasPermission(actor: ActorWithHours): Observable<boolean> {
    return this.apiSvc.hasPermission(actor.user);
  }

  isLoggedIn(): Observable<boolean> {
    return this.apiSvc.isLoggedIn();
  }

  getRole(): Observable<string> {
    return this.apiSvc.getRole();
  }

  bulkDelete() {
    this.apiSvc.bulkDelete("actor", this.checkboxItems).subscribe((result: any) => {
      this.toastr.success(result, '', {timeOut: 3000});
      this.checkboxItems = [];
      this.loadActors();
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

  askForConfirmation(i:number, actorId: string) {
    const toastrRef = this.toastr.warning(`Click here to confirm you wish to delete the actor at index ${i+1}!`, '', {
      timeOut: 5000,
      tapToDismiss: true,
      onActivateTick: true
    });
  
    toastrRef.onTap.subscribe(() => {
      this.deleteActor(actorId);
    });
  }

  switchPage(pageNumber: (number | string)) {
    this.currentPage = parseInt(pageNumber as string, 10) - 1;
    this.loadActors();
  }
}
