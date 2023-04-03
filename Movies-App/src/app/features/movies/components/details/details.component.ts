import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ApiService } from 'src/app/common/services/api.service.service';
import { AddMovieDto, Movie } from '../models/movie.models';

@Component({
  selector: 'app-details',
  templateUrl: './details.component.html',
  styleUrls: ['./details.component.css']
})
export class MovieDetailsComponent implements OnInit{
  movieId?: string;
  movie?: Movie;

  title?: string;
  release_date?: string;
  duration_in_minutes?: number;
  description?: string;
  pgRating?: string;

  constructor(private apiSvc: ApiService, private router: Router, private activatedRoute: ActivatedRoute) {}
  
  ngOnInit(): void {
    this.activatedRoute.params.subscribe(params => {
      this.movieId = params['id'];
      this.apiSvc.getMovie(this.movieId!).subscribe((movie: Movie) => {
        this.movie = movie;
        this.title = this.movie.title;
        this.release_date = this.movie.release_date;
        this.duration_in_minutes = Number(this.movie.duration_in_minutes);
        this.description = this.movie.description;
        this.pgRating = this.movie.pgRating;
      })
    });
  }

  deleteMovie(movieId: string) {
    if (confirm(`Are you sure you want to delete the movie with id ${this.movieId}?`)) {
      this.apiSvc.deleteMovie(this.movieId!).subscribe((movie: Movie) => {
        this.router.navigateByUrl('movies');
      })
    }
  }

  updateMovie() {
    if (this.title && this.release_date && this.duration_in_minutes && this.description && this.pgRating) {
      const movie: AddMovieDto = {
        title: this.title,
        release_date: this.release_date,
        duration_in_minutes: this.duration_in_minutes,
        description: this.description,
        pgRating: this.pgRating
      }
      this.apiSvc.updateMovie(this.movieId!, movie).subscribe((result: Movie) => {
        this.router.navigateByUrl('movies');
      },
      (err) => {console.log(err)});
    }
  }
}
