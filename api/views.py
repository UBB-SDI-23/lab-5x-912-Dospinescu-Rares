import rest_framework.views
from rest_framework import generics, status
from rest_framework.response import Response

from .serializers import *


class MoviesWithNoReviews(generics.ListCreateAPIView):
    serializer_class = MoviesWithNoReviewsSerializer

    def get_queryset(self):
        queryset = Movie.objects.filter(reviews=None)
        return queryset


class AllMovies(generics.ListCreateAPIView):
    serializer_class = AllMoviesSerializer

    def get_queryset(self):
        queryset = Movie.objects.all()
        return queryset


class MovieWithAllReviews(generics.RetrieveUpdateDestroyAPIView):
    serializer_class = MovieWithAllReviewsSerializer
    queryset = Movie.objects.all()


class MoviesByRating(generics.ListCreateAPIView):
    serializer_class = MoviesByRatingSerializer

    def get_queryset(self):
        # queryset = sorted(Movie.objects.all(), key=lambda m: m.get_rating().get('score__avg'), reverse=True)
        queryset = list(Movie.objects.all())
        n = len(queryset)
        for i in range(n):
            for j in range(0, n - i - 1):
                if queryset[j + 1].get_rating() is None:
                    continue
                elif queryset[j].get_rating() < queryset[j + 1].get_rating():
                    queryset[j], queryset[j + 1] = queryset[j + 1], queryset[j]
        return queryset


class ReviewWithMovieID(generics.ListCreateAPIView):
    serializer_class = ReviewWithMovieIDSerializer

    def get_queryset(self):
        queryset = Review.objects.all()
        min_score = self.request.query_params.get('minScore')

        if min_score is not None:
            queryset = queryset.filter(score__gt=min_score)
        return queryset

    def create(self, request, *args, **kwargs):
        serializer = self.get_serializer(data=request.data, many=isinstance(request.data,list))
        serializer.is_valid(raise_exception=True)
        self.perform_create(serializer)
        headers = self.get_success_headers(serializer.data)
        return Response(serializer.data, status=status.HTTP_201_CREATED, headers=headers)


class AddReviewsToMovie(rest_framework.views.APIView):
    def post(self, request, movie_id, *args, **kwargs):
        is_many = isinstance(request.data, list)
        data = request.data

        if is_many:
            for e in data:
                e['movie_reviewed'] = movie_id
                s = ReviewWithMovieIDSerializer(data=e)
                if s.is_valid():
                    s.save()
            return Response(data=data, status=status.HTTP_200_OK)
        else:
            s = ReviewWithMovieIDSerializer(data=data)
            if s.is_valid():
                s.save()
            return Response(data=data, status=status.HTTP_200_OK)

    def put(self, request, movie_id, *args, **kwargs):
        review_id = request.data.get("review_id", None)
        if review_id is None:
            return Response({'error': 'No review id was provided'}, status=status.HTTP_400_BAD_REQUEST)

        try:
            mv = Review.objects.get(movie_reviewed=movie_id, id=review_id)
        except Review.DoesNotExist:
            return Response({'error': 'The review/movie id combination was wrong'}, status=status.HTTP_400_BAD_REQUEST)

        data = {
            'author': request.data.get('author', mv.author),
            'score': request.data.get('score', mv.score),
            'description': request.data.get('description', mv.description),
            'recommended': request.data.get('recommended', mv.recommended)
        }

        ser = ReviewWithMovieIDSerializer(instance=mv, data=data, partial=True)
        if ser.is_valid():
            ser.save()
            return Response(data=data, status=status.HTTP_200_OK)
        return Response({'error': 'Something broke and its your fault'}, status=status.HTTP_400_BAD_REQUEST)



class ReviewAndMovieDetails(generics.RetrieveUpdateDestroyAPIView):
    serializer_class = ReviewAndMovieDetailsSerializer
    queryset = Review.objects.all()


class ActorList(generics.ListCreateAPIView):
    serializer_class = ActorSerializer

    def get_queryset(self):
        queryset = Actor.objects.all()
        return queryset


class ActorDetail(generics.RetrieveUpdateDestroyAPIView):
    serializer_class = ActorSerializer
    queryset = Actor.objects.all()


class ActorTotalHoursFilmed(generics.ListCreateAPIView):
    serializer_class = ActorTotalHoursFilmedSerializer

    def get_queryset(self):
        queryset = list(Actor.objects.all())
        queryset[0].get_hours_filmed()
        n = len(queryset)
        for i in range(n):
            for j in range(0, n - i - 1):
                if queryset[j + 1].get_hours_filmed() is None:
                    continue
                elif queryset[j].get_hours_filmed() < queryset[j + 1].get_hours_filmed():
                    queryset[j], queryset[j + 1] = queryset[j + 1], queryset[j]
        return queryset


class BoxOfficeList(generics.ListCreateAPIView):
    serializer_class = BoxOfficeSerializer

    def get_queryset(self):
        queryset = BoxOffice.objects.all()
        return queryset


class BoxOfficeDetail(generics.RetrieveUpdateDestroyAPIView):
    serializer_class = BoxOfficeSerializer
    queryset = BoxOffice.objects.all()


class MoviesAndActorsList(generics.ListCreateAPIView):
    serializer_class = MoviesAndActorsSerializer

    def get_queryset(self):
        queryset = MoviesAndActors.objects.all()
        return queryset


class MovieAndActorDetail(generics.RetrieveUpdateDestroyAPIView):
    serializer_class = MoviesAndActorsSerializer
    queryset = MoviesAndActors.objects.all()
