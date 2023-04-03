import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { AddMovieDto, Movie, MovieRating } from 'src/app/features/movies/components/overview/models/movie.models';

@Injectable({
  providedIn: 'root'
})
export class ApiService {

  baseUrl = 'http://ec2-16-16-76-22.eu-north-1.compute.amazonaws.com/api';
  constructor(private http: HttpClient) { }

  getAllMovies(): Observable<Movie[]> {
    return this.http.get(`${this.baseUrl}/movie/all/`) as Observable<Movie[]>;
  }

  getMovie(movieId: string): Observable<Movie> {
    return this.http.get(`${this.baseUrl}/movie/${movieId}/`) as Observable<Movie>;
  }

  addMovie(movie: AddMovieDto): Observable<Movie> {
    return this.http.post(`${this.baseUrl}/movie/all/`, movie) as Observable<Movie>;
  }

  deleteMovie(movieId: string): Observable<Movie> {
    return this.http.delete(`${this.baseUrl}/movie/${movieId}/`) as Observable<Movie>;
  }

  updateMovie(movieId: string, movie: AddMovieDto): Observable<Movie> {
    return this.http.put(`${this.baseUrl}/movie/${movieId}/`, movie) as Observable<Movie>;
  }

  getAllMoviesByRating(): Observable<MovieRating[]> {
    return this.http.get(`${this.baseUrl}/movie/rating/`) as Observable<MovieRating[]>;
  }
}
