from django.db import models
from django.db.models import Avg, Sum


class Movie(models.Model):
    title = models.CharField(max_length=100)
    release_date = models.DateField()
    duration_in_minutes = models.IntegerField()
    description = models.CharField(max_length=300)
    pgRating = models.CharField(max_length=10)

    def __str__(self):
        return self.title + ' - ' + str(self.release_date) + ' - ' + str(self.duration_in_minutes)\
            + ' - ' + self.description + ' - ' + self.pgRating

    def get_rating(self):
        return Review.objects.filter(movie_reviewed=self.id).aggregate(Avg('score')).get('score__avg')


class Review(models.Model):
    """
    One-to-many relationship with Movie(A movie can have multiple reviews but a review can only be related to one movie)
    """
    author = models.CharField(max_length=100)
    date_added = models.DateField(auto_now_add=True)
    score = models.IntegerField()
    description = models.CharField(max_length=300)
    movie_reviewed = models.ForeignKey(Movie, on_delete=models.CASCADE, related_name='reviews')

    RECOMMENDED_CHOICES = [
        ("Y", "Positive Review"),
        ("N", "Negative Review"),
    ]

    recommended = models.CharField(max_length=1, choices=RECOMMENDED_CHOICES)

    def __str__(self):
        return self.author + ' - ' + str(self.score) + ' - ' + self.description\
            + ' - ' + self.movie_reviewed.title + ' - ' + self.recommended


class Actor(models.Model):
    """
    Many-to-many relationship with Movie(An actor can appear in multiple movies and a movie can have multiple actors)
    """
    first_name = models.CharField(max_length=100)
    last_name = models.CharField(max_length=100)
    description = models.CharField(max_length=300)
    day_of_birth = models.DateField()
    place_of_birth = models.CharField(max_length=100)

    def __str__(self):
        return self.first_name + ' - ' + self.last_name + ' - ' + self.description + ' - ' + str(self.day_of_birth)\
            + ' - ' + self.place_of_birth

    def get_hours_filmed(self):
        return MoviesAndActors.objects.filter(actor=self.id).aggregate(Sum('total_hours_filmed')).get('total_hours_filmed__sum')


class MoviesAndActors(models.Model):
    movie = models.ForeignKey(Movie, on_delete=models.CASCADE)
    actor = models.ForeignKey(Actor, on_delete=models.CASCADE)
    total_hours_filmed = models.IntegerField()
    director_notes = models.CharField(max_length=100)

    def __str__(self):
        return str(self.movie.title) + ' - ' + str(self.actor.first_name) + ' ' + str(self.actor.last_name) + ' - '\
            + str(self.total_hours_filmed) + ' - ' + self.director_notes


class BoxOffice(models.Model):
    """
    One-to-one relationship with Movie(A movie can only have on record at the box office)
    """
    budget_in_millions = models.IntegerField()
    lifetime_gross_in_millions = models.IntegerField()
    distributor = models.CharField(max_length=100)
    movie_referenced = models.OneToOneField(Movie, on_delete=models.CASCADE, related_name="boxOffice")

    def __str__(self):
        return str(self.budget_in_millions) + ' - ' + str(self.lifetime_gross_in_millions) + ' - ' + self.distributor
