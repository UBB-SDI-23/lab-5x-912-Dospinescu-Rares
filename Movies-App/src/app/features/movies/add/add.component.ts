import { Component, OnInit } from '@angular/core';
import { ApiService } from 'src/app/common/services/api.service.service';
import { AddMovieDto, Movie } from '../models/movie.models';
import { ActivatedRoute, Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { SharedDataService } from 'src/app/common/services/shared-data.service.service';

@Component({
  selector: 'app-add',
  templateUrl: './add.component.html',
  styleUrls: ['./add.component.css']
})
export class MovieAddComponent implements OnInit {
  PGRatings = ['G', 'PG', 'PG-13', 'R', 'NC-17'];

  title?: string;
  release_date?: string;
  duration_in_minutes?: (number | string);
  description?: string;
  pgRating?: string;

  constructor(private apiSvc: ApiService, private router: Router, private toastr: ToastrService, private activatedRoute: ActivatedRoute, private sharedData: SharedDataService) {}

  ngOnInit(): void {

  }

  addMovie() {
    if (this.title && this.release_date && this.duration_in_minutes && this.description && this.pgRating) {
      if (this.title.length > 100) {
        this.toastr.error('The title cannot be longer than 100 characters!', '', {timeOut: 3000});
        return;
      }
      
      if (new Date(this.release_date) > new Date()) {
        this.toastr.error('The release date cannot be in the future!', '', {timeOut: 3000});
        return;
      }

      if (isNaN(Number(this.duration_in_minutes))) {
        this.toastr.error('The duration of the movie needs to be a number!', '', {timeOut: 3000});
        return;
      }
      
      this.duration_in_minutes = parseInt(this.duration_in_minutes as string, 10);
      if (this.duration_in_minutes < 0) {
        this.toastr.error('The duration of the movie cannot be a negative number!', '', {timeOut: 3000});
        return;
      }

      if (this.description.length > 300) {
        this.toastr.error('The description cannot be longer than 300 characters!', '', {timeOut: 3000});
        return;
      }

      if (!this.PGRatings.includes(this.pgRating)) {
        this.toastr.error('The PG Rating needs to be one of the following: G, PG, PG-13, R, NC-17!', '', {timeOut: 3000});
        return;
      }

      const movie: AddMovieDto = {
      title: this.title,
      release_date: this.release_date,
      duration_in_minutes: this.duration_in_minutes,
      description: this.description,
      pgRating: this.pgRating
      }
      
      this.apiSvc.addMovie(movie).subscribe((result: Movie) => {
        this.toastr.success('The movie was successfully added!', '', {timeOut: 3000});
        this.goBack();
      },
      (err) => {
        this.toastr.error('Something went wrong while adding the movie!', '', {timeOut: 10000});
        console.log(err);
      });
    }
    else {
      this.toastr.error('All fields must be filled!', '', {timeOut: 3000});
    }
  }
 
  goBack() {
    this.sharedData.stepback();
  }
}
