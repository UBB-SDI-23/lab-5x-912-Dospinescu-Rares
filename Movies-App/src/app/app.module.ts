import { NgModule } from '@angular/core';

import { AppComponent } from './app.component';
import { HomeComponent } from './common/home/home.component';
import { ReviewlessMoviesComponent } from './features/movies/reviewless/reviewless-movies.component';
import { MovieOverviewComponent } from './features/movies/overview/overview.component';
import { MovieAddComponent } from './features/movies/add/add.component';
import { MovieDetailsComponent } from './features/movies/details/details.component';
import { MoviesByRatingComponent } from './features/movies/by-rating/by-rating.component';
import { ReviewOverviewComponent } from './features/reviews/overview/overview.component';
import { ReviewAddComponent } from './features/reviews/add/add.component';
import { ReviewDetailsComponent } from './features/reviews/details/details.component';
import { ActorsOverviewComponent } from './features/actors/overview/actors-overview.component';
import { ActorsAddComponent } from './features/actors/add/actors-add.component';
import { ActorsDetailsComponent } from './features/actors/details/actors-details.component';
import { ActorsTotalHoursComponent } from './features/actors/total-hours/actors-total-hours.component';
import { BoxOfficeOverviewComponent } from './features/boxOffice/overview/box-office-overview.component';
import { BoxOfficeAddComponent } from './features/boxOffice/add/box-office-add.component';
import { BoxOfficeDetailsComponent } from './features/boxOffice/details/box-office-details.component';
import { MoviesAndActorsOverviewComponent } from './features/moviesAndActors/overview/movies-and-actors-overview.component';
import { MoviesAndActorsAddComponent } from './features/moviesAndActors/add/movies-and-actors-add.component';
import { MoviesAndActorsDetailsComponent } from './features/moviesAndActors/details/movies-and-actors-details.component';

import { BrowserModule } from '@angular/platform-browser';
import { AppRoutingModule } from './app-routing.module';
import { HttpClientModule } from '@angular/common/http';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { ToastrModule } from 'ngx-toastr';


@NgModule({
  declarations: [
    AppComponent,
    HomeComponent,
    ReviewlessMoviesComponent,
    MovieOverviewComponent,
    MovieAddComponent,
    MovieDetailsComponent,
    MoviesByRatingComponent,
    ReviewOverviewComponent,
    ReviewAddComponent,
    ReviewDetailsComponent,
    ActorsOverviewComponent,
    ActorsAddComponent,
    ActorsDetailsComponent,
    ActorsTotalHoursComponent,
    BoxOfficeOverviewComponent,
    BoxOfficeAddComponent,
    BoxOfficeDetailsComponent,
    MoviesAndActorsOverviewComponent,
    MoviesAndActorsAddComponent,
    MoviesAndActorsDetailsComponent,
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    HttpClientModule,
    ReactiveFormsModule,
    FormsModule,
    BrowserAnimationsModule,
    ToastrModule.forRoot()
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
