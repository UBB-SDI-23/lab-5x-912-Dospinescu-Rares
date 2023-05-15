import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { ApiService } from 'src/app/common/services/api.service.service';
import { SharedDataService } from 'src/app/common/services/shared-data.service.service';
import { User, UpdateUserDto } from '../models/user.models';
import { Observable, combineLatest } from 'rxjs';

@Component({
  selector: 'app-user-detail',
  templateUrl: './user-detail.component.html',
  styleUrls: ['./user-detail.component.css']
})
export class UserDetailComponent implements OnInit{
  userId?: string;
  user?: User;
  roles = ['regular', 'moderator', 'admin'];

  username?: string;
  email?: string;
  role?: string;

  constructor(private apiSvc: ApiService, private router: Router, private activatedRoute: ActivatedRoute, private toastr: ToastrService, private sharedData: SharedDataService) {}
  
  ngOnInit(): void {
    this.activatedRoute.params.subscribe(params => {
      this.userId = params['id'];
      this.apiSvc.getUserDetail(this.userId!).subscribe((user: User) => {
        this.user = user;
        this.username = this.user.username;
        this.email = this.user.email;
        this.role = this.user.role;
      })
    });
  }

  deleteUser() {
    this.apiSvc.deleteUser(this.userId!).subscribe((user: User) => {
        this.goBack();
    })
  }

  askForConfirmation() {
    const toastrRef = this.toastr.warning(`Click here to confirm you wish to delete the user with username "${this.username}"!`, '', {
      timeOut: 5000,
      tapToDismiss: true,
      onActivateTick: true
    });
  
    toastrRef.onTap.subscribe(() => {
      this.deleteUser();
    });
  }

  goToUserProfile() {
    this.sharedData.addUrl(`/user/${this.userId}`);
    this.router.navigateByUrl(`/user/profile/${this.userId}`);
  }

  updateUser() {
    if (this.username && this.email && this.role) {
      if (this.username.length < 12) {
        this.toastr.error('The username cannot be shorter than 12 characters!', '', {timeOut: 3000});
        return;
      }
      
      const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;

      if (!emailRegex.test(this.email)) {
        this.toastr.error('The email address is not valid!', '', {timeOut: 3000});
        return;
      }

      if (!this.roles.includes(this.role)) {
        this.toastr.error('The role needs to be one of the following: regular, moderator or admin!', '', {timeOut: 3000});
        return;
      }
      
      const user: UpdateUserDto = {
        username: this.username,
        email: this.email,
        role: this.role,
      }
      
      var success = 'The user was succesfully updated!'

      var userInfo = combineLatest([this.apiSvc.getUsername(), this.apiSvc.getRole(), this.apiSvc.getId()])
        .subscribe(([username, role, id]) => {
          console.log(this.user!.username, username);
          console.log(this.user!.id, id);
          console.log(this.user!.role, role)
          if (this.user!.username === username && parseInt(this.user!.id, 10) === id && this.user!.role !== this.role) {
            success = 'You modified your own role so you have been logged out!'
          }
        });
      userInfo.unsubscribe();

      this.apiSvc.updateUser(this.userId!, user).subscribe((result: User) => {
        this.toastr.success(success, '', {timeOut: 3000});
        if (success === 'You modified your own role so you have been logged out!') {
          this.apiSvc.logOut();
        }
        this.goBack();
      },
      (err) => {this.toastr.error('Something went wrong while updating the user!', '', {timeOut: 10000});});
    }
    else {
      this.toastr.error('All fields must be filled!', '', {timeOut: 3000});
    }
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