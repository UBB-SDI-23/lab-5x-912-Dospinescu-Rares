import { Component, OnInit } from '@angular/core';
import { Review } from '../models/review.models';
import { ApiService } from 'src/app/common/services/api.service.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-overview',
  templateUrl: './overview.component.html',
  styleUrls: ['./overview.component.css']
})
export class ReviewOverviewComponent implements OnInit{
  reviews: Review[] = [];

  constructor(private apiSvc: ApiService, private router: Router) {}

  ngOnInit(): void {
    this.apiSvc.getReviews().subscribe((reviews: Review[]) => {
      this.reviews = reviews;
    });
  }

  goToReviewDetails(reviewId: string) {
    this.router.navigateByUrl(`/reviews/${reviewId}`)
  }

  goToAddReviewPage() {
    this.router.navigateByUrl(`/reviews/add`);
  }

  deleteReview(i:number, reviewId: string) {
    if (confirm(`Are you sure you want to delete the review at index ${i+1}?`)) {
      this.apiSvc.deleteReview(reviewId).subscribe((reviews: Review) => {
        this.apiSvc.getReviews().subscribe((reviews: Review[]) => {
          this.reviews = reviews;
      });
      })
    }
  }
}