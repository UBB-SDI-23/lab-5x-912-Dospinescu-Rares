import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { HomeComponent } from './common/home/home.component';
import { MoviesOverviewComponent } from './features/movies/components/overview/overview.component';
import { MovieDetailsComponent } from './features/movies/components/details/details.component';
import { AddMovieComponent } from './features/movies/components/add/add.component';
import { MoviesByRatingComponent } from './features/movies/components/by-rating/by-rating.component';

const routes: Routes = [
  {
    path: "",
    component: HomeComponent
  },
  {
    path: "movies",
    component: MoviesOverviewComponent
  },
  {
    path: "movies/rating",
    component: MoviesByRatingComponent
  },
  {
    path: "movies/add",
    component: AddMovieComponent
  },
  {
    path: "movies/:id",
    component: MovieDetailsComponent
  },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
