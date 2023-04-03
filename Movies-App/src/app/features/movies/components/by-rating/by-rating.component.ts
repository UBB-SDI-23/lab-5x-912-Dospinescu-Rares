import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { ApiService } from 'src/app/common/services/api.service.service';
import { MovieRating } from '../overview/models/movie.models';

@Component({
  selector: 'app-by-rating',
  templateUrl: './by-rating.component.html',
  styleUrls: ['./by-rating.component.css']
})
export class MoviesByRatingComponent {
  moviesByRating: MovieRating[] = [];

  constructor(private apiSvc: ApiService, private router: Router) {}

  ngOnInit(): void {
    this.apiSvc.getAllMoviesByRating().subscribe((moviesByRating: MovieRating[]) => {
        this.moviesByRating = moviesByRating;
    });
  }
}
