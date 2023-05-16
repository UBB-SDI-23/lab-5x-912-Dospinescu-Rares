import { Component, OnInit } from '@angular/core';
import { Review, ReviewsWithTotal } from '../models/review.models';
import { ApiService } from 'src/app/common/services/api.service.service';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { HttpResponse } from '@angular/common/http';
import { PaginationService } from 'src/app/common/services/pagination.service.service';
import { SharedDataService } from 'src/app/common/services/shared-data.service.service';
import { Observable, combineLatest } from 'rxjs';
 
@Component({
  selector: 'app-overview',
  templateUrl: './overview.component.html',
  styleUrls: ['./overview.component.css']
})
export class ReviewOverviewComponent implements OnInit{
  reviews: ReviewsWithTotal[] = [];
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
    this.loadReviews();
  }

  loadReviews(): void {
    this.checkboxItems = [];
    this.status = "processing";
    this.apiSvc.getReviews(this.currentPage, this.pageSize).subscribe(
      (response: HttpResponse<ReviewsWithTotal[]>) => {
        this.reviews = response.body!;
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
    this.sharedData.prepareToNavigate("/reviews", this.currentPage, this.pageSize)
    this.router.navigateByUrl(`/movies/${movieId}`);
  }

  goToUserDetails(userId: string) {
    this.sharedData.prepareToNavigate("/reviews", this.currentPage, this.pageSize)
    this.router.navigateByUrl(`/user/profile/${userId}`);
  }

  goToReviewDetails(reviewId: string) {
    this.sharedData.prepareToNavigate("/reviews", this.currentPage, this.pageSize)
    this.router.navigateByUrl(`/reviews/${reviewId}`)
  }

  goToAddReviewPage() {
    this.sharedData.prepareToNavigate("reviews", this.currentPage, this.pageSize)
    this.router.navigateByUrl(`/reviews/add`);
  }

  deleteReview(reviewId: string) {
    this.apiSvc.deleteReview(reviewId).subscribe((review: Review) => {
      this.toastr.success(`The review was succesfully deleted!`, '', {timeOut: 3000});
      this.loadReviews();
    })
  }

  hasPermission(movie: ReviewsWithTotal): Observable<boolean> {
    return this.apiSvc.hasPermission(movie.user);
  }

  isLoggedIn(): Observable<boolean> {
    return this.apiSvc.isLoggedIn();
  }

  getRole(): Observable<string> {
    return this.apiSvc.getRole();
  }

  bulkDelete() {
    this.apiSvc.bulkDelete("review", this.checkboxItems).subscribe((result: any) => {
      this.toastr.success(result, '', {timeOut: 3000});
      this.checkboxItems = [];
      this.loadReviews();
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

  askForConfirmation(i:number, reviewId: string) {
    const toastrRef = this.toastr.warning(`Click here to confirm you wish to delete the review at index ${i+1}!`, '', {
      timeOut: 5000,
      tapToDismiss: true,
      onActivateTick: true
    });
  
    toastrRef.onTap.subscribe(() => {
      this.deleteReview(reviewId);
    });
  }

  switchPage(pageNumber: (number | string)) {
    this.currentPage = parseInt(pageNumber as string, 10) - 1;
    this.loadReviews();
  }
}
