import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { AddMovieDto, Movie, MovieRating } from 'src/app/features/movies/components/models/movie.models';
import { AddReviewDto, Review } from 'src/app/features/reviews/components/models/review.models';

@Injectable({
  providedIn: 'root'
})
export class ApiService {

   baseUrl = 'http://ec2-13-50-246-75.eu-north-1.compute.amazonaws.com/api'; // Use this when deploying to netlify
  // baseUrl = '/api'; // Use this when working with Microsoft Visual Studio Code
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

  getReviews(): Observable<Review[]> {
    return this.http.get(`${this.baseUrl}/review/`) as Observable<Review[]>;
  }

  addReview(review: AddReviewDto): Observable<Review> {
    return this.http.post(`${this.baseUrl}/review/`, review) as Observable<Review>;
  }

  deleteReview(reviewId: string): Observable<Review> {
    return this.http.delete(`${this.baseUrl}/review/${reviewId}/`) as Observable<Review>;
  }
}
