import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ApiService } from 'src/app/common/services/api.service.service';
import { MoviesAndActors, MoviesAndActorsWithPositive, UpdateMoviesAndActorsDto } from '../models/moviesAndActors.models';
import { ToastrService } from 'ngx-toastr';
import { SharedDataService } from 'src/app/common/services/shared-data.service.service';
import { MovieWithRating } from '../../movies/models/movie.models';
import { ActorWithHours } from '../../actors/models/actors.models';

@Component({
  selector: 'app-movies-and-actors-details',
  templateUrl: './movies-and-actors-details.component.html',
  styleUrls: ['./movies-and-actors-details.component.css']
})
export class MoviesAndActorsDetailsComponent implements OnInit{
  moviesAndActorsId?: string;
  moviesAndActors?: MoviesAndActorsWithPositive;

  movie?: MovieWithRating;
  actor?: ActorWithHours;
  total_hours_filmed?: (number | string);
  director_notes?: string;

  constructor(private apiSvc: ApiService, private router: Router, private activatedRoute: ActivatedRoute, private toastr: ToastrService, private sharedData: SharedDataService) {}
  
  ngOnInit(): void {
    this.activatedRoute.params.subscribe(params => {
      this.moviesAndActorsId = params['id'];
      this.apiSvc.getMoviesAndActorsDetail(this.moviesAndActorsId!).subscribe((moviesAndActors: MoviesAndActorsWithPositive) => {
        this.moviesAndActors = moviesAndActors;
        this.movie = this.moviesAndActors.movie;
        this.actor = this.moviesAndActors.actor;
        this.total_hours_filmed = Number(this.moviesAndActors.total_hours_filmed);
        this.director_notes = this.moviesAndActors.director_notes;
      })
    });
  }

  deleteMoviesAndActors() {
    this.apiSvc.deleteMoviesAndActors(this.moviesAndActorsId!).subscribe((moviesAndActors: MoviesAndActors) => {
        this.goBack();
    })
  }

  askForConfirmation() {
    const toastrRef = this.toastr.warning(`Click here to confirm you wish to delete the relation between movie "${this.movie!.title}" and actor "${this.actor!.first_name} ${this.actor!.last_name}"!`, '', {
      timeOut: 5000,
      tapToDismiss: true,
      onActivateTick: true
    });
  
    toastrRef.onTap.subscribe(() => {
      this.deleteMoviesAndActors();
    });
  }

  updateMoviesAndActors() {
    if (this.total_hours_filmed && this.director_notes) {
      if (isNaN(Number(this.total_hours_filmed))) {
        this.toastr.error('The total hours filmed for this movie needs to be a number!', '', {timeOut: 3000});
        return;
      }
      
      this.total_hours_filmed = parseInt(this.total_hours_filmed as string, 10);
      if (this.total_hours_filmed < 0) {
        this.toastr.error('The total hours filmed for this movie needs to be between 0 and 100!', '', {timeOut: 3000});
        return;
      }
  
      if (this.director_notes.length > 100) {
        this.toastr.error('The director notes cannot be longer than 100 characters!', '', {timeOut: 3000});
        return;
      }

      const moviesAndActors: UpdateMoviesAndActorsDto = {
        total_hours_filmed: this.total_hours_filmed,
        director_notes: this.director_notes,
      }

      this.apiSvc.updateMoviesAndActors(this.moviesAndActorsId!, moviesAndActors).subscribe((result: MoviesAndActors) => {
        this.toastr.success('The relation was succesfully updated!', '', {timeOut: 3000});
        this.goBack();
      },
      (err) => {this.toastr.error('Something went wrong while updating the relation!', '', {timeOut: 10000});});
    }
    else {
      this.toastr.error('All fields must be filled!', '', {timeOut: 3000});
    }
  }

  goToMovieDetails(movieId: string) {
    this.sharedData.addUrl(`/moviesandactors/${this.moviesAndActorsId}`)
    this.router.navigateByUrl(`/movies/${movieId}`);
  }

  goToActorDetails(actorId: string) {
    this.sharedData.addUrl(`/moviesandactors/${this.moviesAndActorsId}`)
    this.router.navigateByUrl(`/actor/${actorId}`);
  }

  goBack() {
    this.sharedData.stepback();
  }
}
