from django.test import TestCase
from api.models import Movie, Review


class MovieModelTestcase(TestCase):
    @classmethod
    def setUpTestData(cls):
        Movie.objects.create(title="TestMovie", release_date="2000-01-01", duration_in_minutes=60,
                             description="This is a tests movie", pgRating="PG")

    def test_string_method(self):
        movie = Movie.objects.get(title="TestMovie")
        expected_string = 'TestMovie - 2000-01-01 - 60 - This is a tests movie - PG'
        self.assertEqual(str(movie), expected_string)

    def test_get_rating(self):
        movie = Movie.objects.get(title="TestMovie")
        self.assertEqual(movie.get_rating(), None)
        Review.objects.create(author="TestAuthor_1", date_added="2000-01-01", score=20,
                              description="This is a tests review_1", movie_reviewed=movie)
        self.assertEqual(movie.get_rating(), 20)
        Review.objects.create(author="TestAuthor_2", date_added="2000-01-01", score=70,
                              description="This is a tests review_2", movie_reviewed=movie)
        self.assertEqual(movie.get_rating(), 45)
