from django.test import TestCase
from api.models import Movie, Actor, MoviesAndActors


class ActorModelTestcase(TestCase):
    @classmethod
    def setUpTestData(cls):
        Actor.objects.create(first_name="TestActorFN", last_name="TestActorLN", description="This is a tests actor",
                             day_of_birth="2000-01-01", place_of_birth="TestPlace")

    def test_string_method(self):
        movie = Actor.objects.get(first_name="TestActorFN")
        expected_string = 'TestActorFN - TestActorLN - This is a tests actor - 2000-01-01 - TestPlace'
        self.assertEqual(str(movie), expected_string)

    def test_get_hours_filmed(self):
        movie1 = Movie.objects.create(title="TestMovie_1", release_date="2000-01-01", duration_in_minutes=60,
                                      description="This is a tests movie_1", pgRating="PG")
        movie2 = Movie.objects.create(title="TestMovie_2", release_date="2000-01-01", duration_in_minutes=60,
                                      description="This is a tests movie_2", pgRating="PG")
        actor = Actor.objects.get(first_name="TestActorFN")
        self.assertEqual(actor.get_hours_filmed(), None)
        MoviesAndActors.objects.create(movie=movie1, actor=actor,
                                       total_hours_filmed=20, director_notes="Test director notes_1")
        self.assertEqual(actor.get_hours_filmed(), 20)
        MoviesAndActors.objects.create(movie=movie2, actor=actor,
                                       total_hours_filmed=75, director_notes="Test director notes_2")
        self.assertEqual(actor.get_hours_filmed(), 95)
