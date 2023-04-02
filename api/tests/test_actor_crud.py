from api.models import Actor
from rest_framework.test import APITestCase


class ActorListViewTest(APITestCase):
    @classmethod
    def setUpTestData(cls):
        number_of_actors = 30
        for actor_id in range(number_of_actors):
            Actor.objects.create(first_name=f"TestActorFN_{actor_id}", last_name=f"TestActorLN_{actor_id}",
                                 description=f"This is a test actor_{actor_id}", day_of_birth="2000-01-01",
                                 place_of_birth=f"TestPlace_{actor_id}")

    def test_url_exists(self):
        response = self.client.get("/api/actor/")
        self.assertEqual(response.status_code, 200)

    def test_count_correctly_returned(self):
        response = self.client.get("/api/actor/")
        self.assertEqual(len(response.data), 30)

    def test_update(self):
        actor = Actor.objects.filter(first_name="TestActorFN_5")
        self.assertEqual(actor[0].place_of_birth, "TestPlace_5")
        actor.update(place_of_birth="Romania")
        self.assertEqual(actor[0].place_of_birth, "Romania")

    def test_delete(self):
        Actor.objects.filter(first_name="TestActorFN_7").delete()

        response = self.client.get("/api/actor/")
        self.assertEqual(len(response.data), 29)

        actor = Actor.objects.filter(first_name="TestActorFN_7")
        self.assertEqual(len(actor), 0)
