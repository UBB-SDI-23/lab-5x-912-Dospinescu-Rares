import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { HttpClientModule } from '@angular/common/http';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { HomeComponent } from './common/home/home.component';
import { MoviesOverviewComponent } from './features/movies/components/overview/overview.component';
import { MovieDetailsComponent } from './features/movies/components/details/details.component';
import { AddMovieComponent } from './features/movies/components/add/add.component';
import { FormsModule } from '@angular/forms';
import { MovieUpdateComponent } from './features/movies/components/update/update.component';
import { MoviesByRatingComponent } from './features/movies/components/by-rating/by-rating.component';
import { ReviewOverviewComponent } from './features/reviews/components/overview/overview.component';
import { ReviewAddComponent } from './features/reviews/components/add/add.component';
import { ReviewDetailsComponent } from './features/reviews/components/details/details.component';

@NgModule({
  declarations: [
    AppComponent,
    HomeComponent,
    MoviesOverviewComponent,
    MovieDetailsComponent,
    AddMovieComponent,
    MovieUpdateComponent,
    MoviesByRatingComponent,
    ReviewOverviewComponent,
    ReviewAddComponent,
    ReviewDetailsComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    HttpClientModule,
    FormsModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
