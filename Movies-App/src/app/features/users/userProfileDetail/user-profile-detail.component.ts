import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { Observable } from 'rxjs';
import { ApiService } from 'src/app/common/services/api.service.service';
import { SharedDataService } from 'src/app/common/services/shared-data.service.service';
import { UserProfile, UpdateUserProfileDto, User } from '../models/user.models';

@Component({
  selector: 'app-user-profile-detail',
  templateUrl: './user-profile-detail.component.html',
  styleUrls: ['./user-profile-detail.component.css']
})
export class UserProfileDetailComponent implements OnInit{
  userId?: string;
  userProfile?: UserProfile;
  genders = ['M', 'F', 'O'];
  marital_statuses = ['S', 'M', 'D', 'W'];

  bio?: string;
  location?: string;
  birthday?: string;
  gender?: string;
  marital_status?: string;

  constructor(private apiSvc: ApiService, private router: Router, private activatedRoute: ActivatedRoute, private toastr: ToastrService, private sharedData: SharedDataService) {}
  
  ngOnInit(): void {
    this.activatedRoute.params.subscribe(params => {
      this.userId = params['id'];
      this.apiSvc.getUserProfileDetail(this.userId!).subscribe((userProfile: UserProfile) => {
        this.userProfile = userProfile;
        this.bio = this.userProfile.bio;
        this.location = this.userProfile.location;
        this.birthday = this.userProfile.birthday;
        this.gender = this.userProfile.gender;
        this.marital_status = this.userProfile.marital_status;
      })
    });
  }

  goToUserDetail(userId: string) {
    this.sharedData.addUrl(`/user/profile/${this.userId}`);
    this.router.navigateByUrl(`/user/${userId}`);
  }

  updateUser() {
    if (this.bio && this.location && this.birthday && this.gender && this.marital_status) {
      if (this.bio.length > 200) {
        this.toastr.error('The bio cannot be longer than 200 characters!', '', {timeOut: 3000});
        return;
      }

      if (this.location.length > 200) {
        this.toastr.error('The location cannot be longer than 200 characters!', '', {timeOut: 3000});
        return;
      }

      if (new Date(this.birthday) > new Date()) {
        this.toastr.error('The birthday cannot be in the future!', '', {timeOut: 3000});
        return;
      }

      if (!this.genders.includes(this.gender)) {
        this.toastr.error('The gender needs to be one of the following: M, F, or O!', '', {timeOut: 3000});
        return;
      }

      if (!this.marital_statuses.includes(this.marital_status)) {
        this.toastr.error('The marital status needs to be one of the following: S, M, D, or W!', '', {timeOut: 3000});
        return;
      }
      
      const userProfile: UpdateUserProfileDto = {
        bio: this.bio,
        location: this.location,
        birthday: this.birthday,
        gender: this.gender,
        marital_status: this.marital_status,
      }

      this.apiSvc.updateUserProfile(this.userId!, userProfile).subscribe((result: UserProfile) => {
        this.toastr.success('The user profile was succesfully updated!', '', {timeOut: 3000});
        this.goBack();
      },
      (err) => {this.toastr.error('Something went wrong while updating the user profile!', '', {timeOut: 10000});});
    }
    else {
      this.toastr.error('All fields must be filled!', '', {timeOut: 3000});
    }
  }

  goToUserDetails(userId: string) {
    this.sharedData.addUrl(`/user/profile/${this.userId}`);
    this.router.navigateByUrl(`/user/${userId}`);
  }

  hasPermission(user: User): Observable<boolean> {
    return this.apiSvc.hasPermission(user);
  }

  isLoggedIn(): Observable<boolean> {
    return this.apiSvc.isLoggedIn();
  }

  getRole(): Observable<string> {
    return this.apiSvc.getRole();
  }

  goBack() {
    this.sharedData.stepback();
  }
}