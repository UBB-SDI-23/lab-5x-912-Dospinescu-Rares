import { Component, OnInit } from '@angular/core';
import { ApiService } from 'src/app/common/services/api.service.service';
import { AddReviewDto, Review } from '../models/review.models';
import { ActivatedRoute, Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { SharedDataService } from 'src/app/common/services/shared-data.service.service';
import { FormBuilder, FormControl } from '@angular/forms';
import { debounceTime } from 'rxjs/operators';
import { MovieWithRating } from '../../movies/models/movie.models';
import { HttpResponse } from '@angular/common/http';

@Component({
  selector: 'app-add',
  templateUrl: './add.component.html',
  styleUrls: ['./add.component.css']
})
export class ReviewAddComponent implements OnInit {
  author?: string;
  score?: (number | string);
  description?: string;
  recommended?: string = 'Y';
;
  movie_reviewed_id?: number;

  movie_reviewed = new FormControl();
  movies: MovieWithRating[] = [];
  chosen: number = 0;

  constructor(private apiSvc: ApiService, private router: Router, private toastr: ToastrService, private activatedRoute: ActivatedRoute, private sharedData: SharedDataService, private fb: FormBuilder) {}

  ngOnInit(): void {
    this.movie_reviewed.valueChanges.pipe(
      debounceTime(500)
    ).subscribe(title => {
      if (this.chosen === 0) {
        this.getMovies(title);
      }
      else {
        this.chosen = 0;
      }
    });

    const inputField = document.getElementById('movie_reviewed');
    if (inputField) {
      inputField.addEventListener('click', (event: MouseEvent) => {
        this.getMovies(this.movie_reviewed.value);
      });
    }
    document.addEventListener('click', this.closeDropDown.bind(this));
  }

  getMovies(title: string) {
    if (title === null) {
      title = "";
    }
    this.apiSvc.getMoviesByTitle(0, 10, title).subscribe(
      (response: HttpResponse<MovieWithRating[]>) => {
        if (this.movie_reviewed.value !== response.headers.get('Filtered-By-Title') && title !== '') {
          return;
        }
        this.movies = response.body!;
      },
      error => {
        this.toastr.error('Something went wrong while fetching the movies!', '', {timeOut: 10000});;
      }
    );
  }

  addReview() {
    if (this.author && this.score && this.description && this.recommended && this.movie_reviewed_id) {
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

      const review: AddReviewDto = {
        movie_reviewed_id: this.movie_reviewed_id!,
        author: this.author,
        score: this.score,
        description: this.description,
        recommended: this.recommended
      }
      this.apiSvc.addReview(review).subscribe((result: Review) => {
        this.toastr.success('The review was successfully added!', '', {timeOut: 3000});
        this.goBack();
      },
      (err: any) => {this.toastr.error('Something went wrong while adding the review!', '', {timeOut: 10000});});
    }
    else {
      this.toastr.error('All fields must be filled!', '', {timeOut: 3000});
    }
  }

  onMovieSelect(movie: MovieWithRating) {
    this.movie_reviewed_id = parseInt(movie.id, 10);
    this.movie_reviewed.setValue(movie.title);
    this.movies = [];
    this.chosen = 1;
  }

  closeDropDown(event: MouseEvent) {
    const clickedElement = event.target as HTMLElement;
    
    const isFormInput = clickedElement.matches('#movie_reviewed');
    const isMovieOption = clickedElement.closest('.movie-option') !== null;
    
    if (!isFormInput && !isMovieOption) {
      this.movies = []
    }
  }

  goBack() {
    this.sharedData.stepback();
  }
}