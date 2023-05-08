import { Component, OnInit } from '@angular/core';
import { ApiService } from 'src/app/common/services/api.service.service';
import { AddMoviesAndActorsDto, MoviesAndActors } from '../models/moviesAndActors.models';
import { ActivatedRoute, Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { SharedDataService } from 'src/app/common/services/shared-data.service.service';
import { FormBuilder, FormControl } from '@angular/forms';
import { debounceTime } from 'rxjs/operators';
import { MovieWithRating } from '../../movies/models/movie.models';
import { HttpResponse } from '@angular/common/http';
import { ActorWithHours } from '../../actors/models/actors.models';

@Component({
  selector: 'app-movies-and-actors-add',
  templateUrl: './movies-and-actors-add.component.html',
  styleUrls: ['./movies-and-actors-add.component.css']
})
export class MoviesAndActorsAddComponent implements OnInit {
  total_hours_filmed?: (number | string);
  director_notes?: string;
;
  movie_id?: number;
  actor_id?: number;

  movie = new FormControl();
  actor = new FormControl();
  movies: MovieWithRating[] = [];
  actors: ActorWithHours[] = [];
  movieChosen: number = 0;
  actorChosen: number = 0;

  constructor(private apiSvc: ApiService, private router: Router, private toastr: ToastrService, private activatedRoute: ActivatedRoute, private sharedData: SharedDataService, private fb: FormBuilder) {}

  ngOnInit(): void {
    this.movie.valueChanges.pipe(
      debounceTime(500)
    ).subscribe(title => {
      if (this.movieChosen === 0) {
        this.getMovies(title);
      }
      else {
        this.movieChosen = 0;
      }
    });

    this.actor.valueChanges.pipe(
      debounceTime(500)
    ).subscribe(full_name => {
      if (this.actorChosen === 0) {
        this.getActors(full_name);
      }
      else {
        this.actorChosen = 0;
      }
    });

    const movieInputField = document.getElementById('movie');
    if (movieInputField) {
      movieInputField.addEventListener('click', (event: MouseEvent) => {
        this.getMovies(this.movie.value);
      });
    }
    document.addEventListener('click', this.closeDropDown.bind(this));
    const actorInputField = document.getElementById('actor');
    if (actorInputField) {
      actorInputField.addEventListener('click', (event: MouseEvent) => {
        this.getActors(this.actor.value);
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
        if (this.movie.value !== response.headers.get('Filtered-By-Title') && title !== '') {
          return;
        }
        this.movies = response.body!;
      },
      error => {
        this.toastr.error('Something went wrong while fetching the movies!', '', {timeOut: 10000});
      }
    );
  }

  getActors(full_name: string) {
    if (full_name === null) {
      full_name = "";
    }
    this.apiSvc.getActorsByFullName(0, 10, full_name).subscribe(
      (response: HttpResponse<ActorWithHours[]>) => {
        if (this.actor.value !== response.headers.get('Filtered-By-Title') && full_name !== '') {
          return;
        }
        this.actors = response.body!;
      },
      error => {
        this.toastr.error('Something went wrong while fetching the actors!', '', {timeOut: 10000});
      }
    );
  }

  addReview() {
    if (this.movie_id && this.actor_id && this.total_hours_filmed && this.director_notes) {
      if (this.director_notes.length > 100) {
        this.toastr.error('The director notes cannot be longer than 100 characters!', '', {timeOut: 3000});
        return;
      }
      
      if (isNaN(Number(this.total_hours_filmed))) {
        this.toastr.error('The total hours filmed needs to be a number!', '', {timeOut: 3000});
        return;
      }
      
      this.total_hours_filmed = parseInt(this.total_hours_filmed as string, 10);
      if (this.total_hours_filmed < 0) {
        this.toastr.error('The total hours filmed of needs to be a positive number!', '', {timeOut: 3000});
        return;
      }

      const moviesAndActors: AddMoviesAndActorsDto = {
        movie: this.movie_id!,
        actor: this.actor_id!,
        total_hours_filmed: this.total_hours_filmed,
        director_notes: this.director_notes,
      }
      this.apiSvc.addMoviesAndActors(moviesAndActors).subscribe((result: MoviesAndActors) => {
        this.toastr.success('The relation was succesfully added!', '', {timeOut: 3000});
        this.goBack();
      },
      (err: any) => {
        this.toastr.error('A relation between this movie and actor already exists!', '', {timeOut: 3000});
      });
    }
    else {
      this.toastr.error('All fields must be filled!', '', {timeOut: 3000});
    }
  }

  onMovieSelect(movie: MovieWithRating) {
    this.movie_id = parseInt(movie.id, 10);
    this.movie.setValue(movie.title);
    this.movies = [];
    this.movieChosen = 1;
  }

  onActorSelect(actor: ActorWithHours) {
    this.actor_id = parseInt(actor.id, 10);
    this.actor.setValue(actor.first_name + " " + actor.last_name);
    this.actors = [];
    this.actorChosen = 1;
  }

  closeDropDown(event: MouseEvent) {
    const clickedElement = event.target as HTMLElement;
    
    const isMovieFormInput = clickedElement.matches('#movie');
    const isMovieOption = clickedElement.closest('.movie-option') !== null;
    const isActorFormInput = clickedElement.matches('#movie');
    const isActorOption = clickedElement.closest('.movie-option') !== null;
    
    if (!isMovieFormInput && !isMovieOption) {
      this.movies = []
    }

    if (!isActorFormInput && !isActorOption) {
      this.actors = []
    }
  }

  goBack() {
    this.sharedData.stepback();
  }
}