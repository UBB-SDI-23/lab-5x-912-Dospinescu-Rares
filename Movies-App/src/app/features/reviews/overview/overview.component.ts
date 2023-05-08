import { Component, OnInit } from '@angular/core';
import { Review, ReviewsWithTotal } from '../models/review.models';
import { ApiService } from 'src/app/common/services/api.service.service';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { HttpResponse } from '@angular/common/http';
import { PaginationService } from 'src/app/common/services/pagination.service.service';
import { SharedDataService } from 'src/app/common/services/shared-data.service.service';
import { combineLatest } from 'rxjs';
 
@Component({
  selector: 'app-overview',
  templateUrl: './overview.component.html',
  styleUrls: ['./overview.component.css']
})
export class ReviewOverviewComponent implements OnInit{
  reviews: ReviewsWithTotal[] = [];
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
    this.loadReviews();
  }

  loadReviews(): void {
    this.status = "";
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
