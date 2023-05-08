import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ApiService } from 'src/app/common/services/api.service.service';
import { BoxOffice, BoxOfficeWithHighestScore, UpdateBoxOfficeDto } from '../models/boxOffice.models';
import { ToastrService } from 'ngx-toastr';
import { SharedDataService } from 'src/app/common/services/shared-data.service.service';
import { MovieWithRating } from '../../movies/models/movie.models';

@Component({
  selector: 'app-box-office-details',
  templateUrl: './box-office-details.component.html',
  styleUrls: ['./box-office-details.component.css']
})
export class BoxOfficeDetailsComponent {
  boxOfficeId?: string;
  boxOffice?: BoxOfficeWithHighestScore;

  budget_in_millions?: (number | string);
  lifetime_gross_in_millions?: (number | string);
  distributor?: string;
  movie_referenced?: MovieWithRating;
  description?: string;

  constructor(private apiSvc: ApiService, private router: Router, private activatedRoute: ActivatedRoute, private toastr: ToastrService, private sharedData: SharedDataService) {}
  
  ngOnInit(): void {
    this.activatedRoute.params.subscribe(params => {
      this.boxOfficeId = params['id'];
      this.apiSvc.getBoxOfficeDetail(this.boxOfficeId!).subscribe((boxOffice: BoxOfficeWithHighestScore) => {
        this.boxOffice = boxOffice;
        this.budget_in_millions = Number(this.boxOffice.budget_in_millions);
        this.lifetime_gross_in_millions = Number(this.boxOffice.lifetime_gross_in_millions);
        this.distributor = this.boxOffice.distributor;
        this.movie_referenced = this.boxOffice.movie_referenced;
        this.description = this.boxOffice.description;
      })
    });
  }

  deleteBoxOffice() {
    this.apiSvc.deleteBoxOffice(this.boxOfficeId!).subscribe((boxOffice: BoxOffice) => {
        this.goBack();
    })
  }

  askForConfirmation() {
    const toastrRef = this.toastr.warning(`Click here to confirm you wish to delete the box office with distributor "${this.distributor}"!`, '', {
      timeOut: 5000,
      tapToDismiss: true,
      onActivateTick: true
    });
  
    toastrRef.onTap.subscribe(() => {
      this.deleteBoxOffice();
    });
  }

  updateBoxOffice() {
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

      const boxoffice: UpdateBoxOfficeDto = {
        budget_in_millions: this.budget_in_millions,
        lifetime_gross_in_millions: this.lifetime_gross_in_millions,
        distributor: this.distributor,
        description: this.description,
      }

      this.apiSvc.updateBoxOffice(this.boxOfficeId!, boxoffice).subscribe((result: BoxOffice) => {
        this.toastr.success('The box office was succesfully updated!', '', {timeOut: 3000});
        this.goBack();
      },
      (err) => {this.toastr.error('Something went wrong while updating the box office!', '', {timeOut: 10000});});
    }
    else {
      this.toastr.error('All fields must be filled!', '', {timeOut: 3000});
    }
  }

  goToMovieDetails(movieId: string) {
    this.sharedData.addUrl(`/boxOffice/${this.boxOfficeId}`)
    this.router.navigateByUrl(`/movies/${movieId}`);
  }

  goBack() {
    this.sharedData.stepback();
  }
}