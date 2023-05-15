import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ApiService } from 'src/app/common/services/api.service.service';
import { AddActorDto, Actor, ActorWithHours } from '../models/actors.models';
import { ToastrService } from 'ngx-toastr';
import { SharedDataService } from 'src/app/common/services/shared-data.service.service';
import { Observable } from 'rxjs';
 
@Component({
  selector: 'app-actors-details',
  templateUrl: './actors-details.component.html',
  styleUrls: ['./actors-details.component.css']
})
export class ActorsDetailsComponent implements OnInit{
  actorId?: string;
  actor?: ActorWithHours;

  first_name?: string;
  last_name?: string;
  description?: string;
  day_of_birth?: string;
  place_of_birth?: string;

  constructor(private apiSvc: ApiService, private router: Router, private activatedRoute: ActivatedRoute, private toastr: ToastrService, private sharedData: SharedDataService) {}
   
  ngOnInit(): void {
    this.activatedRoute.params.subscribe(params => {
      this.actorId = params['id'];
      this.apiSvc.getActorDetail(this.actorId!).subscribe((actor: ActorWithHours) => {
        this.actor = actor;
        this.first_name = this.actor.first_name;
        this.last_name = this.actor.last_name;
        this.description = this.actor.description;
        this.day_of_birth = this.actor.day_of_birth;
        this.place_of_birth = this.actor.place_of_birth;
      })
    });
  }

  deleteActor(actorId: string) {
    this.apiSvc.deleteActor(this.actorId!).subscribe((actor: Actor) => {
        this.goBack();
    })
  }

  askForConfirmation(actorId: string) {
    const toastrRef = this.toastr.warning(`Click here to confirm you wish to delete the actor with id ${this.actorId}!`, '', {
      timeOut: 5000,
      tapToDismiss: true,
      onActivateTick: true
    });
  
    toastrRef.onTap.subscribe(() => {
      this.deleteActor(actorId);
    });
  }

  goToUserDetails(userId: string) {
    this.sharedData.addUrl(`/actors/${this.actorId}`);
    this.router.navigateByUrl(`/user/profile/${userId}`);
  }

  updateActor() {
    if (this.first_name && this.last_name && this.description && this.day_of_birth && this.place_of_birth) {
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

      this.apiSvc.updateActor(this.actorId!, actor).subscribe((result: Actor) => {
        this.toastr.success('The actor was succesfully updated!', '', {timeOut: 3000});
        this.goBack();
      },
      (err) => {
        this.toastr.error('Something went wrong while trying to update the actor!', '', {timeOut: 3000});
      });
    }
    else {
      this.toastr.error('All fields must be filled!', '', {timeOut: 3000});
    }
  }

  hasPermission(actor: ActorWithHours): Observable<boolean> {
    return this.apiSvc.hasPermission(actor.user);
  }

  isLoggedIn(): Observable<boolean> {
    return this.apiSvc.isLoggedIn();
  }

  goBack() {
    this.sharedData.stepback();
  }
}
