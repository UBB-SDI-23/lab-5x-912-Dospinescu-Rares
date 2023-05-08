import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class SharedDataService {
  private urls = new BehaviorSubject<string[]>([]);
  private currentPage = new BehaviorSubject<number>(0);
  private pageSize = new BehaviorSubject<number>(200);

  currentPage$ = this.currentPage.asObservable();
  pageSize$ = this.pageSize.asObservable();

  constructor(private router: Router) {}

  getUrlsLength(): number {
    return this.urls.getValue().length;
  }

  addUrl(str: string) {
    const currentArray = this.urls.getValue();
    const newArray = [...currentArray, str];
    this.urls.next(newArray);
  }

  removeLastUrl(): void {
    const urls = this.urls.getValue();
    urls.pop();
    this.urls.next(urls);
  }

  clear() {
    this.urls.next([]);
    this.currentPage.next(0);
    this.pageSize.next(200);
  }

  prepareToNavigate(origin: string, currentPage: number, pageSize: number) {
    this.addUrl(origin);
    this.currentPage.next(currentPage);
    this.pageSize.next(pageSize);
  }

  stepback() {
    const urls = this.urls.getValue();
    if (urls.length === 0) {
      this.router.navigateByUrl('');
    }
    const lastUrl = urls[urls.length - 1];
    this.router.navigateByUrl(lastUrl);
    this.removeLastUrl();
  }
}
