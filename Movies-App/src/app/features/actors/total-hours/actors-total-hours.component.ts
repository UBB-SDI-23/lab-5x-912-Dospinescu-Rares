import { Component, OnInit } from '@angular/core';
import { Actor, ActorWithHours } from '../models/actors.models';
import { ApiService } from 'src/app/common/services/api.service.service';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { HttpResponse } from '@angular/common/http';
import { PaginationService } from 'src/app/common/services/pagination.service.service';
import { SharedDataService } from 'src/app/common/services/shared-data.service.service';
import { combineLatest } from 'rxjs';

@Component({
  selector: 'app-actors-total-hours',
  templateUrl: './actors-total-hours.component.html',
  styleUrls: ['./actors-total-hours.component.css']
})
export class ActorsTotalHoursComponent implements OnInit{
  actors: ActorWithHours[] = [];
  status = "success";
  currentPage = 0;
  pageTotal = 0;
  pageSize = 200;
  pageArray: (number | string)[] = [];
  resultTotal: number = 0;

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
    this.status = "";
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

  deleteActor(actorId: string) {
    this.apiSvc.deleteActor(actorId).subscribe((actor: Actor) => {
      this.toastr.success(`The actor was succesfully deleted!`, '', {timeOut: 3000});
      this.loadActors();
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
