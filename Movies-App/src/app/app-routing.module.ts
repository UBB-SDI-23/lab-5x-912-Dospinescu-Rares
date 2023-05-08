import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { HomeComponent } from './common/home/home.component';
import { MovieOverviewComponent } from './features/movies/overview/overview.component';
import { MovieDetailsComponent } from './features/movies/details/details.component';
import { MovieAddComponent } from './features/movies/add/add.component';
import { MoviesByRatingComponent } from './features/movies/by-rating/by-rating.component';
import { ReviewOverviewComponent } from './features/reviews/overview/overview.component';
import { ReviewAddComponent } from './features/reviews/add/add.component';
import { ReviewDetailsComponent } from './features/reviews/details/details.component';
import { ActorsOverviewComponent } from './features/actors/overview/actors-overview.component';
import { ActorsTotalHoursComponent } from './features/actors/total-hours/actors-total-hours.component';
import { ActorsAddComponent } from './features/actors/add/actors-add.component';
import { ActorsDetailsComponent } from './features/actors/details/actors-details.component';
import { ReviewlessMoviesComponent } from './features/movies/reviewless/reviewless-movies.component';
import { BoxOfficeOverviewComponent } from './features/boxOffice/overview/box-office-overview.component';
import { BoxOfficeAddComponent } from './features/boxOffice/add/box-office-add.component';
import { BoxOfficeDetailsComponent } from './features/boxOffice/details/box-office-details.component';
import { MoviesAndActorsOverviewComponent } from './features/moviesAndActors/overview/movies-and-actors-overview.component';
import { MoviesAndActorsAddComponent } from './features/moviesAndActors/add/movies-and-actors-add.component';
import { MoviesAndActorsDetailsComponent } from './features/moviesAndActors/details/movies-and-actors-details.component';

const routes: Routes = [
  {
    path: "",
    component: HomeComponent
  },
  {
    path: "movies",
    component: MovieOverviewComponent
  },
  {
    path: "movies/rating",
    component: MoviesByRatingComponent
  },
  {
    path: "movies/reviewless",
    component: ReviewlessMoviesComponent
  },
  {
    path: "movies/add",
    component: MovieAddComponent
  },
  {
    path: "movies/:id",
    component: MovieDetailsComponent
  },
  {
    path: "reviews",
    component: ReviewOverviewComponent
  },
  {
    path: "reviews/add",
    component: ReviewAddComponent
  },
  {
    path: "reviews/:id",
    component: ReviewDetailsComponent
  },
  {
    path: "actors",
    component: ActorsOverviewComponent
  },
  {
    path: "actors/hours",
    component: ActorsTotalHoursComponent
  },
  {
    path: "actors/add",
    component: ActorsAddComponent
  },
  {
    path: "actors/:id",
    component: ActorsDetailsComponent
  },
  {
    path: "boxOffice",
    component: BoxOfficeOverviewComponent
  },
  {
    path: "boxOffice/add",
    component: BoxOfficeAddComponent
  },
  {
    path: "boxOffice/:id",
    component: BoxOfficeDetailsComponent
  },
  {
    path: "moviesandactors",
    component: MoviesAndActorsOverviewComponent
  },
  {
    path: "moviesandactors/add",
    component: MoviesAndActorsAddComponent
  },
  {
    path: "moviesandactors/:id",
    component: MoviesAndActorsDetailsComponent
  },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
