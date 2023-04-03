import { Component } from '@angular/core';
import { AddReviewDto, Review } from '../models/review.models';
import { ApiService } from 'src/app/common/services/api.service.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-add',
  templateUrl: './add.component.html',
  styleUrls: ['./add.component.css']
})
export class ReviewAddComponent {
  author?: string;
  score?: number;
  description?: string;
  recommended?: string;
  movie_reviewed?: number;

  constructor(private apiSvc: ApiService, private router: Router) {}

  addReview() {
    if (this.author && this.score && this.description && this.recommended && this.movie_reviewed) {
      const review: AddReviewDto = {
      author: this.author,
      score: this.score,
      description: this.description,
      recommended: this.recommended,
      movie_reviewed: this.movie_reviewed
      }
      this.apiSvc.addReview(review).subscribe((result: Review) => {
        this.router.navigateByUrl('reviews');
      },
      (err: any) => {console.log(err)});
    }
  }
}
