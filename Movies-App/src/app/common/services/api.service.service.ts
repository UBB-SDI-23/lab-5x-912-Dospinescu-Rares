import { HttpClient, HttpResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, combineLatest, of } from 'rxjs';
import { map, switchMap } from 'rxjs/operators';
import { AddMovieDto, Movie, MovieWithRating, MovieWithReviews } from 'src/app/features/movies/models/movie.models';
import { AddReviewDto, Review, ReviewsWithTotal, UpdateReviewDto } from 'src/app/features/reviews/models/review.models';
import { AddActorDto, Actor, ActorWithHours } from 'src/app/features/actors/models/actors.models';
import { AddBoxOfficeDto, BoxOffice, BoxOfficeWithHighestScore, UpdateBoxOfficeDto } from 'src/app/features/boxOffice/models/boxOffice.models';
import { AddMoviesAndActorsDto, MoviesAndActors, MoviesAndActorsWithPositive, UpdateMoviesAndActorsDto } from 'src/app/features/moviesAndActors/models/moviesAndActors.models';
import { UpdateUserDto, UpdateUserProfileDto, User, UserDto, UserProfile } from 'src/app/features/users/models/user.models';


@Injectable({
  providedIn: 'root'
})
export class ApiService {
  // baseUrl = 'http://127.0.0.1:8000/api'; // Use this on your own machine
  baseUrl = 'https://sdi-dospinescu-rares.jumpingcrab.com/api' // Use this when deploying to netlify

  private usernameSubject = new BehaviorSubject<string>('');
  private roleSubject = new BehaviorSubject<string>('');
  private idSubject = new BehaviorSubject<number>(0);

  constructor(private http: HttpClient) {
    this.loadState();
  }

  private saveState(username: string, role: string, id: number): void {
    localStorage.setItem('usernameSubject', JSON.stringify(username));
    localStorage.setItem('roleSubject', JSON.stringify(role));
    localStorage.setItem('idSubject', JSON.stringify(id));
  }

  private clearState(): void {
    localStorage.removeItem('usernameSubject');
    localStorage.removeItem('roleSubject');
    localStorage.removeItem('idSubject');
  }

  private loadState(): void {
    const savedUsername = localStorage.getItem('usernameSubject');
    const savedRole = localStorage.getItem('roleSubject');
    const savedId = localStorage.getItem('idSubject');

    if (savedUsername && savedRole && savedId) {
      this.usernameSubject.next(JSON.parse(savedUsername));
      this.roleSubject.next(JSON.parse(savedRole));
      this.idSubject.next(JSON.parse(savedId));
    }
  }

  fill(username: string, role: string, id: number): void {
    this.usernameSubject.next(username);
    this.roleSubject.next(role);
    this.idSubject.next(id);
    this.saveState(username, role, id);
  }

  empty(): void {
    this.usernameSubject.next('');
    this.roleSubject.next('');
    this.idSubject.next(0);
    this.clearState();
  }

  isLoggedIn(): Observable<boolean> {
    return combineLatest([
      this.usernameSubject.asObservable(),
      this.roleSubject.asObservable(),
      this.idSubject.asObservable()
    ]).pipe(
      map(([username, role, id]) => {
        return !(username === '' && role === '' && id === 0);
      })
    );
  }

  hasPermission(user: User): Observable<boolean> {
    return this.isLoggedIn().pipe(
      switchMap(isLoggedIn => {
        if (isLoggedIn) {
          if (parseInt(user.id, 10) === this.idSubject.value) {
            return of(true);
          }
          else if (this.roleSubject.value === "admin" || this.roleSubject.value === "moderator") {
            return of(true);
          }
          return of(false);
        } else {
          return of(false);
        }
      })
    );
  }

  getUsername(): Observable<string> {
    return this.usernameSubject.asObservable();
  }

  getRole(): Observable<string> {
    return this.roleSubject.asObservable();
  }

  getId(): Observable<number> {
    return this.idSubject.asObservable();
  }

  getMovies(page: number, size: number): Observable<HttpResponse<MovieWithRating[]>> {
    return this.http.get<MovieWithRating[]>(`${this.baseUrl}/movie/all/?page=${page}&size=${size}`, { observe: 'response' });
  }

  getMovieDetail(movieId: string): Observable<MovieWithReviews> {
    return this.http.get(`${this.baseUrl}/movie/${movieId}/`) as Observable<MovieWithReviews>;
  }

  addMovie(movie: AddMovieDto): Observable<Movie> {
    return this.http.post(`${this.baseUrl}/movie/all/`, movie, { withCredentials: true }) as Observable<Movie>;
  }

  deleteMovie(movieId: string): Observable<Movie> {
    return this.http.delete(`${this.baseUrl}/movie/${movieId}/`, { withCredentials: true }) as Observable<Movie>;
  }

  updateMovie(movieId: string, movie: AddMovieDto): Observable<Movie> {
    return this.http.put(`${this.baseUrl}/movie/${movieId}/`, movie, { withCredentials: true }) as Observable<Movie>;
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
    return this.http.post(`${this.baseUrl}/review/`, review, { withCredentials: true }) as Observable<Review>;
  }

  deleteReview(reviewId: string): Observable<Review> {
    return this.http.delete(`${this.baseUrl}/review/${reviewId}/`, { withCredentials: true }) as Observable<Review>;
  }

  updateReview(reviewId: string, review: UpdateReviewDto): Observable<Review> {
    return this.http.put(`${this.baseUrl}/review/${reviewId}/`, review, { withCredentials: true }) as Observable<Review>;
  }

  getActors(page: number, size: number): Observable<HttpResponse<ActorWithHours[]>> {
    return this.http.get<ActorWithHours[]>(`${this.baseUrl}/actor/?page=${page}&size=${size}`, { observe: 'response' });
  }

  getActorDetail(actorId: string): Observable<ActorWithHours> {
    return this.http.get(`${this.baseUrl}/actor/${actorId}/`) as Observable<ActorWithHours>;
  }

  addActor(actor: AddActorDto): Observable<Actor> {
    return this.http.post(`${this.baseUrl}/actor/`, actor, { withCredentials: true }) as Observable<Actor>;
  }

  deleteActor(actorId: string): Observable<Actor> {
    return this.http.delete(`${this.baseUrl}/actor/${actorId}/`, { withCredentials: true }) as Observable<Actor>;
  }

  updateActor(actorId: string, actor: AddActorDto): Observable<Actor> {
    return this.http.put(`${this.baseUrl}/actor/${actorId}/`, actor, { withCredentials: true }) as Observable<Actor>;
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
    return this.http.post(`${this.baseUrl}/boxOffice/simple/`, boxOffice, { withCredentials: true }) as Observable<BoxOffice>;
  }

  deleteBoxOffice(boxOfficeId: string): Observable<BoxOffice> {
    return this.http.delete(`${this.baseUrl}/boxOffice/${boxOfficeId}/`, { withCredentials: true }) as Observable<BoxOffice>;
  }

  updateBoxOffice(boxOfficeId: string, boxOffice: UpdateBoxOfficeDto): Observable<BoxOffice> {
    return this.http.put(`${this.baseUrl}/boxOffice/${boxOfficeId}/`, boxOffice, { withCredentials: true }) as Observable<BoxOffice>;
  }

  getMoviesAndActors(page: number, size: number): Observable<HttpResponse<MoviesAndActorsWithPositive[]>> {
    return this.http.get<MoviesAndActorsWithPositive[]>(`${this.baseUrl}/movies-and-actors/?page=${page}&size=${size}`, { observe: 'response' });
  }

  getMoviesAndActorsDetail(moviesAndActorsId: string): Observable<MoviesAndActorsWithPositive> {
    return this.http.get(`${this.baseUrl}/movies-and-actors/${moviesAndActorsId}/`) as Observable<MoviesAndActorsWithPositive>;
  }

  addMoviesAndActors(moviesAndActors: AddMoviesAndActorsDto): Observable<MoviesAndActors> {
    return this.http.post(`${this.baseUrl}/movies-and-actors/simple/`, moviesAndActors, { withCredentials: true }) as Observable<MoviesAndActors>;
  }

  deleteMoviesAndActors(moviesAndActorsId: string): Observable<MoviesAndActors> {
    return this.http.delete(`${this.baseUrl}/movies-and-actors/${moviesAndActorsId}/`, { withCredentials: true }) as Observable<MoviesAndActors>;
  }

  updateMoviesAndActors(moviesAndActorsId: string, moviesAndActors: UpdateMoviesAndActorsDto): Observable<MoviesAndActors> {
    return this.http.put(`${this.baseUrl}/movies-and-actors/${moviesAndActorsId}/`, moviesAndActors, { withCredentials: true }) as Observable<MoviesAndActors>;
  }
 
  logIn(username: string, password: string): Observable<any> {
    const body = {
      username: username,
      password: password
    };
    return this.http.post(`${this.baseUrl}/login/`, body, { withCredentials: true }) as Observable<any>;
  }

  logOut(): Observable<any> {
    this.empty();
    return this.http.post(`${this.baseUrl}/logout/`, { withCredentials: true });
  }
  
  getUsers(page: number, size: number): Observable<HttpResponse<User[]>> {
    return this.http.get<User[]>(`${this.baseUrl}/users/?page=${page}&size=${size}`, { withCredentials: true, observe: 'response' });
  }

  getUserDetail(userId: string): Observable<User> {
    return this.http.get(`${this.baseUrl}/user/${userId}/`) as Observable<User>;
  }

  deleteUser(userId: string): Observable<User> {
    return this.http.delete(`${this.baseUrl}/user/${userId}/`, { withCredentials: true }) as Observable<User>;
  }

  updateUser(userId: string, review: UpdateUserDto): Observable<User> {
    return this.http.put(`${this.baseUrl}/user/${userId}/`, review, { withCredentials: true }) as Observable<User>;
  }

  getUserProfileDetail(userId: string): Observable<UserProfile> {
    return this.http.get(`${this.baseUrl}/user/profile/${userId}/`) as Observable<UserProfile>;
  }

  updateUserProfile(userId: string, review: UpdateUserProfileDto): Observable<UserProfile> {
    return this.http.put(`${this.baseUrl}/user/profile/${userId}/`, review, { withCredentials: true }) as Observable<UserProfile>;
  }

  register(user: UserDto): Observable<User> {
    return this.http.post(`${this.baseUrl}/register/`, user, { withCredentials: true }) as Observable<User>;
  }

  registerConfirm(code: string): Observable<any> {
    return this.http.post(`${this.baseUrl}/register/confirm/${code}/`, { withCredentials: true }) as Observable<any>;
  }

  setPageSize(size: number): Observable<any> {
    return this.http.post(`${this.baseUrl}/set/size/${size}/`, {}, { withCredentials: true }) as Observable<any>;
  }

  populateData(option: number, users: number, entities: number): Observable<any> {
    return this.http.post(`${this.baseUrl}/populate/${option}/?user=${users}&entities=${entities}`, {}, { withCredentials: true }) as Observable<any>;
  }

  bulkDelete(model: string, ids: number[]): Observable<any> {
    const body = {
      selected_ids: ids,
    };
    return this.http.post(`${this.baseUrl}/bulk/delete/${model}/`, body, { withCredentials: true }) as Observable<any>;
  }
}
