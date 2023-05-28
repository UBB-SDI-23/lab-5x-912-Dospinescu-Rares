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
  selector: 'app-by-rating',
  templateUrl: './by-rating.component.html',
  styleUrls: ['./by-rating.component.css']
})
export class MoviesByRatingComponent implements OnInit {
  moviesByRating: MovieWithRating[] = [];
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
    this.apiSvc.getMoviesByRating(this.currentPage, this.pageSize).subscribe(
      (response: HttpResponse<MovieWithRating[]>) => {
        this.moviesByRating = response.body!;
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
    this.sharedData.prepareToNavigate("/movies/rating", this.currentPage, this.pageSize)
    this.router.navigateByUrl(`/movies/${movieId}`)
  }

  goToUserDetails(userId: string) {
    this.sharedData.prepareToNavigate("/movies/rating", this.currentPage, this.pageSize)
    this.router.navigateByUrl(`/user/profile/${userId}`);
  }

  hasPermission(movie: MovieWithRating): Observable<boolean> {
    return this.apiSvc.hasPermission(movie.user);
  }

  getRole(): Observable<string> {
    return this.apiSvc.getRole();
  }

  bulkDelete() {
    this.apiSvc.bulkDelete("movie", this.checkboxItems).subscribe((result: any) => {
      this.toastr.success("The bulk delete was successful!", '', {timeOut: 3000});
      this.checkboxItems = [];
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

  deleteMovie(movieId: string) {
    this.apiSvc.deleteMovie(movieId).subscribe((movie: Movie) => {
      this.toastr.success(`The movie was succesfully deleted!`, '', {timeOut: 3000});
      this.loadMovies();
    })
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
