import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ApiService } from 'src/app/common/services/api.service.service';
import { AddMovieDto, Movie, MovieWithRating, MovieWithReviews } from '../models/movie.models';
import { ToastrService } from 'ngx-toastr';
import { SharedDataService } from 'src/app/common/services/shared-data.service.service';
import { ReviewsWithTotal } from '../../reviews/models/review.models';

@Component({
  selector: 'app-details',
  templateUrl: './details.component.html',
  styleUrls: ['./details.component.css']
})
export class MovieDetailsComponent implements OnInit{
  movieId?: string;
  movie?: MovieWithReviews;
  reviews?: ReviewsWithTotal[] = [];
  PGRatings = ['G', 'PG', 'PG-13', 'R', 'NC-17'];
 
  title?: string;
  release_date?: string;
  duration_in_minutes?: (number | string)
  description?: string;
  pgRating?: string;

  constructor(private apiSvc: ApiService, private router: Router, private activatedRoute: ActivatedRoute, private toastr: ToastrService, private sharedData: SharedDataService) {}
  
  ngOnInit(): void {
    this.activatedRoute.params.subscribe(params => {
      this.movieId = params['id'];
      this.apiSvc.getMovieDetail(this.movieId!).subscribe((movie: MovieWithReviews) => {
        this.movie = movie;
        this.title = this.movie.title;
        this.release_date = this.movie.release_date;
        this.duration_in_minutes = Number(this.movie.duration_in_minutes);
        this.description = this.movie.description;
        this.pgRating = this.movie.pgRating;
        this.reviews = this.movie.reviews;
      })
    });
  }

  deleteMovie() {
    this.apiSvc.deleteMovie(this.movieId!).subscribe((movie: Movie) => {
        this.goBack();
    })
  }

  askForConfirmation() {
    const toastrRef = this.toastr.warning(`Click here to confirm you wish to delete the movie with title "${this.title}!"`, '', {
      timeOut: 5000,
      tapToDismiss: true,
      onActivateTick: true
    });
  
    toastrRef.onTap.subscribe(() => {
      this.deleteMovie();
    });
  }

  goToReviewDetails(reviewId: string) {
    this.sharedData.addUrl(`/movies/${this.movieId}`);
    this.router.navigateByUrl(`/reviews/${reviewId}`);
  }

  updateMovie() {
    if (this.title && this.release_date && this.duration_in_minutes && this.description && this.pgRating) {
      if (this.title.length > 100) {
        this.toastr.error('The title cannot be longer than 100 characters!', '', {timeOut: 3000});
        return;
      }
       
      if (new Date(this.release_date) > new Date()) {
        this.toastr.error('The release date cannot be in the future!', '', {timeOut: 3000});
        return;
      }

      if (isNaN(Number(this.duration_in_minutes))) {
        this.toastr.error('The duration of the movie needs to be a number!', '', {timeOut: 3000});
        return;
      }
      
      this.duration_in_minutes = parseInt(this.duration_in_minutes as string, 10);
      if (this.duration_in_minutes < 0) {
        this.toastr.error('The duration of the movie cannot be a negative number!', '', {timeOut: 3000});
        return;
      }

      if (this.description.length > 300) {
        this.toastr.error('The description cannot be longer than 300 characters!', '', {timeOut: 3000});
        return;
      }

      if (!this.PGRatings.includes(this.pgRating)) {
        this.toastr.error('The PG Rating needs to be one of the following: G, PG, PG-13, R, NC-17!', '', {timeOut: 3000});
        return;
      }

      const movie: AddMovieDto = {
        title: this.title,
        release_date: this.release_date,
        duration_in_minutes: this.duration_in_minutes,
        description: this.description,
        pgRating: this.pgRating
      }

      this.apiSvc.updateMovie(this.movieId!, movie).subscribe((result: Movie) => {
        this.toastr.success('The movie was succesfully updated!', '', {timeOut: 3000});
        this.goBack();
      },
      (err) => {this.toastr.error('Something went wrong while updating the movie!', '', {timeOut: 10000});});
    }
    else {
      this.toastr.error('All fields must be filled!', '', {timeOut: 3000});
    }
  }

  goBack() {
    this.sharedData.stepback();
  }
}
