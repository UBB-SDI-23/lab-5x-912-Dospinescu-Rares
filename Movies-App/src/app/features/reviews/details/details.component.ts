import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ApiService } from 'src/app/common/services/api.service.service';
import { Review, ReviewsWithTotal, UpdateReviewDto } from '../models/review.models';
import { ToastrService } from 'ngx-toastr';
import { SharedDataService } from 'src/app/common/services/shared-data.service.service';
import { MovieWithRating } from '../../movies/models/movie.models';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-details',
  templateUrl: './details.component.html',
  styleUrls: ['./details.component.css']
})
export class ReviewDetailsComponent implements OnInit{
  reviewId?: string;
  review?: ReviewsWithTotal;

  author?: string;
  score?: (number | string);
  description?: string;
  movie_reviewed?: MovieWithRating;
  recommended?: string;

  constructor(private apiSvc: ApiService, private router: Router, private activatedRoute: ActivatedRoute, private toastr: ToastrService, private sharedData: SharedDataService) {}
  
  ngOnInit(): void {
    this.activatedRoute.params.subscribe(params => {
      this.reviewId = params['id'];
      this.apiSvc.getReviewDetail(this.reviewId!).subscribe((review: ReviewsWithTotal) => {
        this.review = review;
        this.author = this.review.author;
        this.score = Number(this.review.score);
        this.description = this.review.description;
        this.movie_reviewed = this.review.movie_reviewed;
        this.recommended = this.review.recommended;
      })
    });
  }

  deleteReview() {
    this.apiSvc.deleteReview(this.reviewId!).subscribe((review: Review) => {
        this.goBack();
    })
  }

  askForConfirmation() {
    const toastrRef = this.toastr.warning(`Click here to confirm you wish to delete the review with author "${this.author}"!`, '', {
      timeOut: 5000,
      tapToDismiss: true,
      onActivateTick: true
    });
  
    toastrRef.onTap.subscribe(() => {
      this.deleteReview();
    });
  }

  goToUserDetails(userId: string) {
    this.sharedData.addUrl(`/reviews/${this.review}`);
    this.router.navigateByUrl(`/user/profile/${userId}`);
  }

  updateReview() {
    if (this.author && this.score && this.description && this.recommended) {
      if (this.author.length > 100) {
        this.toastr.error('The author cannot be longer than 100 characters!', '', {timeOut: 3000});
        return;
      }
      
      if (isNaN(Number(this.score))) {
        this.toastr.error('The score needs to be a number!', '', {timeOut: 3000});
        return;
      }
      
      this.score = parseInt(this.score as string, 10);
      if (this.score < 0 || this.score > 100) {
        this.toastr.error('The score of needs to be between 0 and 100!', '', {timeOut: 3000});
        return;
      }
  
      if (this.description.length > 300) {
        this.toastr.error('The description cannot be longer than 300 characters!', '', {timeOut: 3000});
        return;
      }

      const review: UpdateReviewDto = {
        author: this.author,
        score: this.score,
        description: this.description,
        recommended: this.recommended,
      }

      this.apiSvc.updateReview(this.reviewId!, review).subscribe((result: Review) => {
        this.toastr.success('The review was succesfully updated!', '', {timeOut: 3000});
        this.goBack();
      },
      (err) => {this.toastr.error('Something went wrong while updating the review!', '', {timeOut: 10000});});
    }
    else {
      this.toastr.error('All fields must be filled!', '', {timeOut: 3000});
    }
  }

  hasPermission(review: ReviewsWithTotal): Observable<boolean> {
    return this.apiSvc.hasPermission(review.user);
  }

  isLoggedIn(): Observable<boolean> {
    return this.apiSvc.isLoggedIn();
  }
  
  goToMovieDetails(movieId: string) {
    this.sharedData.addUrl(`/reviews/${this.reviewId}`)
    this.router.navigateByUrl(`/movies/${movieId}`);
  }

  goBack() {
    this.sharedData.stepback();
  }
}