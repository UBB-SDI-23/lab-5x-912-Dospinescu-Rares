import { Component } from '@angular/core';
import { ApiService } from 'src/app/common/services/api.service.service';
import { AddMovieDto, Movie } from '../components/overview/models/movie.models';
import { Router } from '@angular/router';

@Component({
  selector: 'app-add',
  templateUrl: './add.component.html',
  styleUrls: ['./add.component.css']
})
export class AddMovieComponent {
  title?: string;
  release_date?: string;
  duration_in_minutes?: number;
  description?: string;
  pgRating?: string;

  constructor(private apiSvc: ApiService, private router: Router) {}

  addMovie() {
    if (this.title && this.release_date && this.duration_in_minutes && this.description && this.pgRating) {
      const movie: AddMovieDto = {
      title: this.title,
      release_date: this.release_date,
      duration_in_minutes: this.duration_in_minutes,
      description: this.description,
      pgRating: this.pgRating
      }
      this.apiSvc.addMovie(movie).subscribe((result: Movie) => {
        this.router.navigateByUrl('movies');
      },
      (err) => {console.log(err)});
    }
  }
}
