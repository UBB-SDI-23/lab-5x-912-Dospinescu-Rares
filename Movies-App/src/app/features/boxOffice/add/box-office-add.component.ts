import { Component, OnInit } from '@angular/core';
import { ApiService } from 'src/app/common/services/api.service.service';
import { AddBoxOfficeDto, BoxOffice } from '../models/boxOffice.models';
import { ActivatedRoute, Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { SharedDataService } from 'src/app/common/services/shared-data.service.service';
import { FormBuilder, FormControl } from '@angular/forms';
import { debounceTime } from 'rxjs/operators';
import { MovieWithRating } from '../../movies/models/movie.models';
import { HttpResponse } from '@angular/common/http';

@Component({
  selector: 'app-box-office-add',
  templateUrl: './box-office-add.component.html',
  styleUrls: ['./box-office-add.component.css']
})
export class BoxOfficeAddComponent implements OnInit {
  budget_in_millions?: (number | string);
  lifetime_gross_in_millions?: (number | string);
  distributor?: string;
  description?: string;

  movie_referenced_id?: number;

  movie_referenced = new FormControl();
  movies: MovieWithRating[] = [];
  chosen: number = 0;

  origin = "";
  currentPage: number = 0;
  pageSize: number = 200;

  constructor(private apiSvc: ApiService, private router: Router, private toastr: ToastrService, private activatedRoute: ActivatedRoute, private sharedData: SharedDataService, private fb: FormBuilder) {}

  ngOnInit(): void {
    this.movie_referenced.valueChanges.pipe(
      debounceTime(500)
    ).subscribe(title => {
      if (this.chosen === 0) {
        this.getMovies(title);
      }
      else {
        this.chosen = 0;
      }
    });

    this.currentPage = parseInt(this.activatedRoute.snapshot.queryParamMap.get('currentPage')!, 10);
    this.pageSize = parseInt(this.activatedRoute.snapshot.queryParamMap.get('pageSize')!, 10);
    this.origin = this.activatedRoute.snapshot.queryParamMap.get('origin')!;

    const inputField = document.getElementById('movie_referenced');
    if (inputField) {
      inputField.addEventListener('click', (event: MouseEvent) => {
        this.getMovies(this.movie_referenced.value);
      });
    }
    document.addEventListener('click', this.closeDropDown.bind(this));
  }

  getMovies(title: string) {
    if (title === null) {
      title = "";
    }
    this.apiSvc.getMoviesWithoutBoxOfficeByTitle(0, 10, title).subscribe(
      (response: HttpResponse<MovieWithRating[]>) => {
        if (this.movie_referenced.value !== response.headers.get('Filtered-By-Title') && title !== '') {
          return;
        }
        this.movies = response.body!;
      },
      error => {
        this.toastr.error('Something went wrong while fetching the movies!', '', {timeOut: 10000});
      }
    );
  }

  addBoxOffice() {
    if (this.budget_in_millions && this.lifetime_gross_in_millions && this.distributor && this.description) {
      if (isNaN(Number(this.budget_in_millions))) {
        this.toastr.error('The budget needs to be a number!', '', {timeOut: 3000});
        return;
      }
      
      this.budget_in_millions = parseInt(this.budget_in_millions as string, 10);
      if (this.budget_in_millions < 0) {
        this.toastr.error('The budget of needs to be a positive number!', '', {timeOut: 3000});
        return;
      }

      if (isNaN(Number(this.lifetime_gross_in_millions))) {
        this.toastr.error('The lifetime gross needs to be a number!', '', {timeOut: 3000});
        return;
      }
      
      this.lifetime_gross_in_millions = parseInt(this.lifetime_gross_in_millions as string, 10);
      if (this.lifetime_gross_in_millions < 0) {
        this.toastr.error('The lifetime gross needs to be a positive number!', '', {timeOut: 3000});
        return;
      }

      if (this.distributor.length > 100) {
        this.toastr.error('The distributor cannot be longer than 100 characters!', '', {timeOut: 3000});
        return;
      }

      if (this.description.length > 300) {
        this.toastr.error('The description cannot be longer than 300 characters!', '', {timeOut: 3000});
        return;
      }

      const boxOffice: AddBoxOfficeDto = {
        budget_in_millions: this.budget_in_millions,
        lifetime_gross_in_millions: this.lifetime_gross_in_millions,
        distributor: this.distributor,
        movie_referenced: this.movie_referenced_id!,
        description: this.description,
      }
      this.apiSvc.addBoxOffice(boxOffice).subscribe((result: BoxOffice) => {
        this.toastr.success('The boxOffice was successfully added!', '', {timeOut: 3000});
        this.goBack();
      },
      (err: any) => {this.toastr.error('Something went wrong while adding the box office!', '', {timeOut: 10000});});
    }
    else {
      this.toastr.error('All fields must be filled!', '', {timeOut: 3000});
    }
  }

  onMovieSelect(movie: MovieWithRating) {
    this.movie_referenced_id = parseInt(movie.id, 10);
    this.movie_referenced.setValue(movie.title);
    this.movies = [];
    this.chosen = 1;
  }

  closeDropDown(event: MouseEvent) {
    const clickedElement = event.target as HTMLElement;
    
    const isFormInput = clickedElement.matches('#movie_referenced');
    const isMovieOption = clickedElement.closest('.movie-option') !== null;
    
    if (!isFormInput && !isMovieOption) {
      this.movies = []
    }
  }

  goBack() {
    this.sharedData.stepback();
  }
}
