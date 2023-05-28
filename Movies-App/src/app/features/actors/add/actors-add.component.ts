import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { ApiService } from 'src/app/common/services/api.service.service';
import { SharedDataService } from 'src/app/common/services/shared-data.service.service';
import { Actor, AddActorDto } from '../models/actors.models';
 
@Component({
  selector: 'app-actors-add',
  templateUrl: './actors-add.component.html',
  styleUrls: ['./actors-add.component.css']
})
export class ActorsAddComponent implements OnInit {
  day_of_birth?: string;
  description?: string;
  first_name?: string;
  last_name?: string;
  place_of_birth?: string;

  origin = "";
  currentPage: number = 0;
  pageSize: number = 200;

  constructor(private apiSvc: ApiService, private router: Router, private toastr: ToastrService, private activatedRoute: ActivatedRoute, private sharedData: SharedDataService) {}

  ngOnInit(): void {
    this.currentPage = parseInt(this.activatedRoute.snapshot.queryParamMap.get('currentPage')!, 10);
    this.pageSize = parseInt(this.activatedRoute.snapshot.queryParamMap.get('pageSize')!, 10);
    this.origin = this.activatedRoute.snapshot.queryParamMap.get('origin')!;
  }

  addActor() {
    if (this.day_of_birth && this.description && this.first_name && this.last_name && this.place_of_birth) {
      if (this.first_name.length > 100) {
        this.toastr.error('The first name cannot be longer than 100 characters!', '', {timeOut: 3000});
        return;
      }

      if (this.last_name.length > 100) {
        this.toastr.error('The last name cannot be longer than 100 characters!', '', {timeOut: 3000});
        return;
      }

      if (this.description.length > 300) {
        this.toastr.error('The description cannot be longer than 300 characters!', '', {timeOut: 3000});
        return;
      }

      if (new Date(this.day_of_birth) > new Date()) {
        this.toastr.error('The day of birth cannot be in the future!', '', {timeOut: 3000});
        return;
      }

      if (this.place_of_birth.length > 100) {
        this.toastr.error('The place of birth cannot be longer than 100 characters!', '', {timeOut: 3000});
        return;
      }

      const actor: AddActorDto = {
        first_name: this.first_name,
        last_name: this.last_name,
        description: this.description,
        day_of_birth: this.day_of_birth,
        place_of_birth: this.place_of_birth
      }
      
      this.apiSvc.addActor(actor).subscribe((result: Actor) => {
        this.toastr.success('The actor was successfully added!', '', {timeOut: 3000});
        this.goBack();
      },
      (err) => {this.toastr.error('Something went wrong while adding the actor!', '', {timeOut: 10000});});
    }
    else {
      this.toastr.error('All fields must be filled!', '', {timeOut: 3000});
    }
  }

  goBack() {
    this.sharedData.stepback();
  }
}