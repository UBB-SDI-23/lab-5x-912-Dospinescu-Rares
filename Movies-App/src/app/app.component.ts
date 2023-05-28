import { Component, OnInit } from '@angular/core';
import { ApiService } from './common/services/api.service.service';
import { ToastrService } from 'ngx-toastr';
import { Router } from '@angular/router';
import { SharedDataService } from './common/services/shared-data.service.service';
import { Observable } from 'rxjs';

interface Message {
  nickname: string;
  content: string;
}

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {
  constructor(private apiSvc: ApiService, private toastr: ToastrService, private router: Router, private sharedData: SharedDataService) {}

  ngOnInit(): void {
    this.createEventListeners(document.getElementById('dropdownEntitiesLink')!, document.getElementById('dropdownEntities')!);
    this.createEventListeners(document.getElementById('dropdownStatisticsLink')!, document.getElementById('dropdownStatistics')!);
    this.createEventListeners(document.getElementById('dropdownAdminLink')!, document.getElementById('dropdownAdmin')!);
    this.createEventListeners(document.getElementById('dropdownAccountLink')!, document.getElementById('dropdownAccount')!);
  }

  createEventListeners(toggle: HTMLElement, menu: HTMLElement) {
    toggle!.addEventListener('click', function() {
      menu!.classList.toggle('hidden');
    });

    window.addEventListener('click', function(event) {
      if (!menu!.contains(event.target as Node) && !toggle!.contains(event.target as Node)) {
        menu!.classList.add('hidden');
      }
    });

    const items = menu!.querySelectorAll('a');
    items.forEach(function(item) {
      item.addEventListener('click', function() {
        menu!.classList.add('hidden');
      });
    });
  }

  goToAccountDetails() {
    var id;
    var api = this.apiSvc.getId().subscribe(user_id => {
      id = user_id;
    });
    api.unsubscribe();

    this.router.navigateByUrl(`/user/${id}`);
  }

  goToUseProfile() {
    var id;
    var api = this.apiSvc.getId().subscribe(user_id => {
      id = user_id;
    });
    api.unsubscribe();

    this.router.navigateByUrl(`user/profile/${id}`);
  }

  isLoggedIn(): Observable<boolean> {
    return this.apiSvc.isLoggedIn();
  }

  getRole(): Observable<string> {
    return this.apiSvc.getRole();
  }

  getUsername(): Observable<string> {
    return this.apiSvc.getUsername();
  }

  logOut() {
    this.toastr.success('You have been logged out!', '', {timeOut: 3000});
    this.apiSvc.logOut();
    this.sharedData.clear();
  }
}
