from api.models import Movie
from rest_framework.test import APITestCase


class MoviesWithNoReviewsListViewTest(APITestCase):
    @classmethod
    def setUpTestData(cls):
        number_of_movies = 30
        for movie_id in range(number_of_movies):
            Movie.objects.create(title=f"TestMovie_{movie_id}", release_date="2000-01-01", duration_in_minutes=movie_id,
                                 description=f"This is a test movie_{movie_id}", pgRating="PG")

    def test_url_exists(self):
        response = self.client.get("/api/movie/")
        self.assertEqual(response.status_code, 200)

    def test_count_correctly_returned(self):
        response = self.client.get("/api/movie/")
        self.assertEqual(len(response.data), 30)

    def test_update(self):
        movie = Movie.objects.filter(title="TestMovie_5")
        self.assertEqual(movie[0].duration_in_minutes, 5)
        movie.update(duration_in_minutes=200)
        self.assertEqual(movie[0].duration_in_minutes, 200)

    def test_delete(self):
        Movie.objects.filter(title="TestMovie_7").delete()

        response = self.client.get("/api/movie/")
        self.assertEqual(len(response.data), 29)

        movie = Movie.objects.filter(title="TestMovie_7")
        self.assertEqual(len(movie), 0)

