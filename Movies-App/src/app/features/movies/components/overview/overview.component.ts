import { Component, OnInit } from '@angular/core';
import { Movie } from './models/movie.models';
import { ApiService } from 'src/app/common/services/api.service.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-overview',
  templateUrl: './overview.component.html',
  styleUrls: ['./overview.component.css']
})
export class MoviesOverviewComponent implements OnInit {
  movies: Movie[] = [];

  constructor(private apiSvc: ApiService, private router: Router) {}

  ngOnInit(): void {
    this.apiSvc.getAllMovies().subscribe((movies: Movie[]) => {
        this.movies = movies;
        this.movies.sort((a, b) => (a.title < b.title ? -1 : 1));
    });
  }

  goToMovieDetails(movieId: string) {
    this.router.navigateByUrl(`/movies/${movieId}`)
  }

  goToAddMoviePage() {
    this.router.navigateByUrl(`/movies/add`);
  }

  goToMovieEdit(movieId: string) {
    this.router.navigateByUrl(`/movies/add`);
  }

  goToAddMoviesByRating() {
    this.router.navigateByUrl(`/movies/rating`);
  }

  deleteMovie(i:number, movieId: string) {
    if (confirm(`Are you sure you want to delete the movie at index ${i+1}?`)) {
      this.apiSvc.deleteMovie(movieId).subscribe((movie: Movie) => {
        this.apiSvc.getAllMovies().subscribe((movies: Movie[]) => {
          this.movies = movies;
      });
      })
    }
  }
}
