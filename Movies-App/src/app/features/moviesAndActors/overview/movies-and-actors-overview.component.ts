import { Component, OnInit } from '@angular/core';
import { MoviesAndActors, MoviesAndActorsWithPositive } from '../models/moviesAndActors.models';
import { ApiService } from 'src/app/common/services/api.service.service';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { HttpResponse } from '@angular/common/http';
import { PaginationService } from 'src/app/common/services/pagination.service.service';
import { SharedDataService } from 'src/app/common/services/shared-data.service.service';
import { Observable, combineLatest } from 'rxjs';

@Component({
  selector: 'app-movies-and-actors-overview',
  templateUrl: './movies-and-actors-overview.component.html',
  styleUrls: ['./movies-and-actors-overview.component.css']
})
export class MoviesAndActorsOverviewComponent implements OnInit{
  relations: MoviesAndActorsWithPositive[] = [];
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
    this.loadMoviesAndActors();
  }

  loadMoviesAndActors(): void {
    this.checkboxItems = [];
    this.status = "processing";
    this.apiSvc.getMoviesAndActors(this.currentPage, this.pageSize).subscribe(
      (response: HttpResponse<MoviesAndActorsWithPositive[]>) => {
        this.relations = response.body!;
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

  goToMovieDetails(movieId: string) {
    this.sharedData.prepareToNavigate("/moviesandactors", this.currentPage, this.pageSize)
    this.router.navigateByUrl(`/movies/${movieId}`);
  }

  goToUserDetails(userId: string) {
    this.sharedData.prepareToNavigate("/moviesandactors", this.currentPage, this.pageSize)
    this.router.navigateByUrl(`/user/profile/${userId}`);
  }

  goToActorDetails(actorId: string) {
    this.sharedData.prepareToNavigate("/moviesandactors", this.currentPage, this.pageSize)
    this.router.navigateByUrl(`/actors/${actorId}`)
  }

  goToMoviesAndActorsDetails(moviesAndActorsId: string) {
    this.sharedData.prepareToNavigate("/moviesandactors", this.currentPage, this.pageSize)
    this.router.navigateByUrl(`/moviesandactors/${moviesAndActorsId}`);
  }

  goToAddMoviesAndActorsPage() {
    this.sharedData.prepareToNavigate("moviesandactors", this.currentPage, this.pageSize)
    this.router.navigateByUrl(`/moviesandactors/add`);
  }

  deleteMoviesAndActors(moviesAndActorsId: string) {
    this.apiSvc.deleteMoviesAndActors(moviesAndActorsId).subscribe((moviesAndActors: MoviesAndActors) => {
      this.toastr.success(`The relation was succesfully deleted!`, '', {timeOut: 3000});
      this.loadMoviesAndActors();
    })
  }

  hasPermission(relation: MoviesAndActorsWithPositive): Observable<boolean> {
    return this.apiSvc.hasPermission(relation.user);
  }

  isLoggedIn(): Observable<boolean> {
    return this.apiSvc.isLoggedIn();
  }

  getRole(): Observable<string> {
    return this.apiSvc.getRole();
  }

  bulkDelete() {
    this.apiSvc.bulkDelete("movies_and_actors", this.checkboxItems).subscribe((result: any) => {
      this.toastr.success(result, '', {timeOut: 3000});
      this.checkboxItems = [];
      this.loadMoviesAndActors();
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

  askForConfirmation(i:number, moviesAndActorsId: string) {
    const toastrRef = this.toastr.warning(`Click here to confirm you wish to delete the relation at index ${i+1}!`, '', {
      timeOut: 5000,
      tapToDismiss: true,
      onActivateTick: true
    });
  
    toastrRef.onTap.subscribe(() => {
      this.deleteMoviesAndActors(moviesAndActorsId);
    });
  }

  switchPage(pageNumber: (number | string)) {
    this.currentPage = parseInt(pageNumber as string, 10) - 1;
    this.loadMoviesAndActors();
  }
}