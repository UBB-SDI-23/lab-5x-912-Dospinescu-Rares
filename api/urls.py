from django.urls import path
from .views import *

urlpatterns = [
    path('movie/rating', MoviesByRating.as_view()),
    path('movie/all', AllMovies.as_view()),
    path('movie/', MoviesWithNoReviews.as_view()),
    path('movie/<int:pk>/', MovieWithAllReviews.as_view()),
    path('movie/<int:movie_id>/review', AddReviewsToMovie.as_view()),
    path('review/', ReviewWithMovieID.as_view()),
    path('review/<int:pk>/', ReviewAndMovieDetails.as_view()),
    path('actor/', ActorList.as_view()),
    path('actor/<int:pk>/', ActorDetail.as_view()),
    path('actor/hours/', ActorTotalHoursFilmed.as_view()),
    path('boxOffice/', BoxOfficeList.as_view()),
    path('boxOffice/<int:pk>', BoxOfficeDetail.as_view()),
    path('movies-and-actors/', MoviesAndActorsList.as_view()),
    path('movies-and-actors/<int:pk>', MovieAndActorDetail.as_view())
]
