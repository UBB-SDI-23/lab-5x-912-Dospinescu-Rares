import { HttpClient, HttpResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { AddMovieDto, Movie, MovieWithRating, MovieWithReviews } from 'src/app/features/movies/models/movie.models';
import { AddReviewDto, Review, ReviewsWithTotal, UpdateReviewDto } from 'src/app/features/reviews/models/review.models';
import { AddActorDto, Actor, ActorWithHours } from 'src/app/features/actors/models/actors.models';
import { AddBoxOfficeDto, BoxOffice, BoxOfficeWithHighestScore, UpdateBoxOfficeDto } from 'src/app/features/boxOffice/models/boxOffice.models';
import { AddMoviesAndActorsDto, MoviesAndActors, MoviesAndActorsWithPositive, UpdateMoviesAndActorsDto } from 'src/app/features/moviesAndActors/models/moviesAndActors.models';

@Injectable({
  providedIn: 'root'
})
export class ApiService {

  //baseUrl = 'https://ec2-16-171-45-33.eu-north-1.compute.amazonaws.com/api'; // Use this when working with Visual Studio Code
  //baseUrl = '/api'; // Use this when deploying to netlify
  baseUrl = 'https://sdi-dospinescu-rares.jumpingcrab.com/api'

  constructor(private http: HttpClient) { }

  getMovies(page: number, size: number): Observable<HttpResponse<MovieWithRating[]>> {
    return this.http.get<MovieWithRating[]>(`${this.baseUrl}/movie/all/?page=${page}&size=${size}`, { observe: 'response' });
  }

  getMovieDetail(movieId: string): Observable<MovieWithReviews> {
    return this.http.get(`${this.baseUrl}/movie/${movieId}/`) as Observable<MovieWithReviews>;
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

  getReviewlessMovies(page: number, size: number): Observable<HttpResponse<MovieWithRating[]>> {
    return this.http.get<MovieWithRating[]>(`${this.baseUrl}/movie/?page=${page}&size=${size}`, { observe: 'response' });
  }

  getMoviesByRating(page: number, size: number): Observable<HttpResponse<MovieWithRating[]>> {
    return this.http.get<MovieWithRating[]>(`${this.baseUrl}/movie/rating/?page=${page}&size=${size}`, { observe: 'response' });
  }

  getMoviesByTitle(page: number, size: number, title: string): Observable<HttpResponse<MovieWithRating[]>> {
    return this.http.get<MovieWithRating[]>(`${this.baseUrl}/movie/all/?page=${page}&size=${size}&search=${title}`, { observe: 'response' });
  }

  getMoviesWithoutBoxOfficeByTitle(page: number, size: number, title: string): Observable<HttpResponse<MovieWithRating[]>> {
    return this.http.get<MovieWithRating[]>(`${this.baseUrl}/movie/all/?page=${page}&size=${size}&search=${title}&nbo=y`, { observe: 'response' });
  }

  getReviews(page: number, size: number): Observable<HttpResponse<ReviewsWithTotal[]>> {
    return this.http.get<ReviewsWithTotal[]>(`${this.baseUrl}/review/?page=${page}&size=${size}`, { observe: 'response' });
  }

  getReviewDetail(reviewId: string): Observable<ReviewsWithTotal> {
    return this.http.get(`${this.baseUrl}/review/${reviewId}/`) as Observable<ReviewsWithTotal>;
  }

  addReview(review: AddReviewDto): Observable<Review> {
    return this.http.post(`${this.baseUrl}/review/`, review) as Observable<Review>;
  }

  deleteReview(reviewId: string): Observable<Review> {
    return this.http.delete(`${this.baseUrl}/review/${reviewId}/`) as Observable<Review>;
  }

  updateReview(reviewId: string, review: UpdateReviewDto): Observable<Review> {
    return this.http.put(`${this.baseUrl}/review/${reviewId}/`, review) as Observable<Review>;
  }

  getActors(page: number, size: number): Observable<HttpResponse<ActorWithHours[]>> {
    return this.http.get<ActorWithHours[]>(`${this.baseUrl}/actor/?page=${page}&size=${size}`, { observe: 'response' });
  }

  getActorDetail(actorId: string): Observable<ActorWithHours> {
    return this.http.get(`${this.baseUrl}/actor/${actorId}/`) as Observable<ActorWithHours>;
  }

  addActor(actor: AddActorDto): Observable<Actor> {
    return this.http.post(`${this.baseUrl}/actor/`, actor) as Observable<Actor>;
  }

  deleteActor(actorId: string): Observable<Actor> {
    return this.http.delete(`${this.baseUrl}/actor/${actorId}/`) as Observable<Actor>;
  }

  updateActor(actorId: string, actor: AddActorDto): Observable<Actor> {
    return this.http.put(`${this.baseUrl}/actor/${actorId}/`, actor) as Observable<Actor>;
  }

  getActorsByHours(page: number, size: number): Observable<HttpResponse<ActorWithHours[]>> {
    return this.http.get<ActorWithHours[]>(`${this.baseUrl}/actor/hours/?page=${page}&size=${size}`, { observe: 'response' });
  }

  getActorsByFullName(page: number, size: number, full_name: string): Observable<HttpResponse<ActorWithHours[]>> {
    return this.http.get<ActorWithHours[]>(`${this.baseUrl}/actor/?page=${page}&size=${size}&search=${full_name}`, { observe: 'response' });
  }

  getBoxOffices(page: number, size: number): Observable<HttpResponse<BoxOfficeWithHighestScore[]>> {
    return this.http.get<BoxOfficeWithHighestScore[]>(`${this.baseUrl}/boxOffice/?page=${page}&size=${size}`, { observe: 'response' });
  }

  getBoxOfficeDetail(boxOfficeId: string): Observable<BoxOfficeWithHighestScore> {
    return this.http.get(`${this.baseUrl}/boxOffice/${boxOfficeId}/`) as Observable<BoxOfficeWithHighestScore>;
  }

  addBoxOffice(boxOffice: AddBoxOfficeDto): Observable<BoxOffice> {
    return this.http.post(`${this.baseUrl}/boxOffice/simple/`, boxOffice) as Observable<BoxOffice>;
  }

  deleteBoxOffice(boxOfficeId: string): Observable<BoxOffice> {
    return this.http.delete(`${this.baseUrl}/boxOffice/${boxOfficeId}/`) as Observable<BoxOffice>;
  }

  updateBoxOffice(boxOfficeId: string, boxOffice: UpdateBoxOfficeDto): Observable<BoxOffice> {
    return this.http.put(`${this.baseUrl}/boxOffice/${boxOfficeId}/`, boxOffice) as Observable<BoxOffice>;
  }

  getMoviesAndActors(page: number, size: number): Observable<HttpResponse<MoviesAndActorsWithPositive[]>> {
    return this.http.get<MoviesAndActorsWithPositive[]>(`${this.baseUrl}/movies-and-actors/?page=${page}&size=${size}`, { observe: 'response' });
  }

  getMoviesAndActorsDetail(moviesAndActorsId: string): Observable<MoviesAndActorsWithPositive> {
    return this.http.get(`${this.baseUrl}/movies-and-actors/${moviesAndActorsId}/`) as Observable<MoviesAndActorsWithPositive>;
  }

  addMoviesAndActors(moviesAndActors: AddMoviesAndActorsDto): Observable<MoviesAndActors> {
    return this.http.post(`${this.baseUrl}/movies-and-actors/simple/`, moviesAndActors) as Observable<MoviesAndActors>;
  }

  deleteMoviesAndActors(moviesAndActorsId: string): Observable<MoviesAndActors> {
    return this.http.delete(`${this.baseUrl}/movies-and-actors/${moviesAndActorsId}/`) as Observable<MoviesAndActors>;
  }

  updateMoviesAndActors(moviesAndActorsId: string, moviesAndActors: UpdateMoviesAndActorsDto): Observable<MoviesAndActors> {
    return this.http.put(`${this.baseUrl}/movies-and-actors/${moviesAndActorsId}/`, moviesAndActors) as Observable<MoviesAndActors>;
  }
}
