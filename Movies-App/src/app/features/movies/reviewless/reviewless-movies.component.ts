import { Component, OnInit } from '@angular/core';
import { Movie, MovieWithRating } from '../models/movie.models';
import { ApiService } from 'src/app/common/services/api.service.service';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { HttpResponse } from '@angular/common/http';
import { PaginationService } from 'src/app/common/services/pagination.service.service';
import { SharedDataService } from 'src/app/common/services/shared-data.service.service';
import { Observable, combineLatest } from 'rxjs';

@Component({
  selector: 'app-reviewless-movies',
  templateUrl: './reviewless-movies.component.html',
  styleUrls: ['./reviewless-movies.component.css']
})
export class ReviewlessMoviesComponent implements OnInit {
  movies: MovieWithRating[] = [];
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
    this.loadMovies();
  }

  loadMovies(): void {
    this.checkboxItems = [];
    this.status = "processing";
    this.apiSvc.getReviewlessMovies(this.currentPage, this.pageSize).subscribe(
      (response: HttpResponse<MovieWithRating[]>) => {
        this.movies = response.body!;
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

  goToMovieDetails(movieId: string) {
    this.sharedData.prepareToNavigate("/movies/reviewless", this.currentPage, this.pageSize)
    this.router.navigateByUrl(`/movies/${movieId}`);
  }

  goToUserDetails(userId: string) {
    this.sharedData.prepareToNavigate("/movies/reviewless", this.currentPage, this.pageSize)
    this.router.navigateByUrl(`/user/profile/${userId}`);
  }

  goToAddMoviePage() {
    this.sharedData.prepareToNavigate("/movies/reviewless", this.currentPage, this.pageSize)
    this.router.navigateByUrl(`/movies/add`);
  }

  sortMovies() {
    this.movies.sort((a, b) => (a.title < b.title ? -1 : 1));
  }

  hasPermission(movie: MovieWithRating): Observable<boolean> {
    return this.apiSvc.hasPermission(movie.user);
  }

  isLoggedIn(): Observable<boolean> {
    return this.apiSvc.isLoggedIn();
  }

  deleteMovie(movieId: string) {
    this.apiSvc.deleteMovie(movieId).subscribe((movie: Movie) => {
      this.toastr.success(`The movie was succesfully deleted!`, '', {timeOut: 3000});
      this.loadMovies();
    })
  }

  getRole(): Observable<string> {
    return this.apiSvc.getRole();
  }

  bulkDelete() {
    this.apiSvc.bulkDelete("movie", this.checkboxItems).subscribe((result: any) => {
      this.toastr.success(result, '', {timeOut: 3000});
      this.loadMovies();
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

  askForConfirmation(i:number, movieId: string) {
    const toastrRef = this.toastr.warning(`Click here to confirm you wish to delete the movie at index ${i+1}!`, '', {
      timeOut: 5000,
      tapToDismiss: true,
      onActivateTick: true
    });
  
    toastrRef.onTap.subscribe(() => {
      this.deleteMovie(movieId);
    });
  }

  switchPage(pageNumber: (number | string)) {
    this.currentPage = parseInt(pageNumber as string, 10) - 1;
    this.loadMovies();
  }
}
