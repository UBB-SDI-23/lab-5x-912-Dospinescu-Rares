import datetime
from rest_framework import serializers
from .models import *


class MoviesWithNoReviewsSerializer(serializers.ModelSerializer):
    def validate(self, data):
        """
        Checks to see if the duration in minutes is not negative and if the release date of the movie is in the past
        """
        if data['duration_in_minutes'] < 0:
            raise serializers.ValidationError("The duration of the movie needs to be positive")
        if data['release_date'] > datetime.date.today():
            raise serializers.ValidationError("The release date of the movie needs to be in the past")
        return data

    class Meta:
        model = Movie
        fields = '__all__'


class AllMoviesSerializer(serializers.ModelSerializer):
    class Meta:
        model = Movie
        fields = '__all__'


class MoviesByRatingSerializer(serializers.ModelSerializer):
    overall_rating = serializers.SerializerMethodField()

    class Meta:
        model = Movie
        fields = ['id',
                  'title',
                  'release_date',
                  'duration_in_minutes',
                  'description',
                  'pgRating',
                  'overall_rating',
                  ]

    def get_overall_rating(self, obj):
        return obj.get_rating()


class ActorTotalHoursFilmedSerializer(serializers.ModelSerializer):
    hours_filmed = serializers.SerializerMethodField()

    class Meta:
        model = Actor
        fields = ['id',
                  'first_name',
                  'last_name',
                  'description',
                  'day_of_birth',
                  'place_of_birth',
                  'hours_filmed',
                  ]

    def get_hours_filmed(self, obj):
        return obj.get_hours_filmed()


class ReviewWithMovieIDSerializer(serializers.ModelSerializer):
    def validate(self, data):
        """
        Checks to see if the score of the review is between 0 and 100
        """
        if data['score'] < 0 or data['score'] > 100:
            raise serializers.ValidationError("The score of the review needs to be between 0 and 100")
        return data


    class Meta:
        model = Review
        fields = '__all__'


class ReviewAndMovieDetailsSerializer(serializers.ModelSerializer):
    movie_reviewed = MoviesWithNoReviewsSerializer(read_only=True)

    class Meta:
        model = Review
        fields = '__all__'


class MovieWithAllReviewsSerializer(serializers.ModelSerializer):
    reviews = ReviewWithMovieIDSerializer(read_only=True, many=True)

    class Meta:
        model = Movie
        fields = ['id',
                  'title',
                  'release_date',
                  'duration_in_minutes',
                  'description',
                  'pgRating',
                  'reviews',
                  ]


class ActorSerializer(serializers.ModelSerializer):
    def validate(self, data):
        """
        Checks to see if the date of birth of the actor is in the future
        """
        if data['day_of_birth'] > datetime.date.today():
            raise serializers.ValidationError("The day of birth of the actor needs to be in the past")
        return data

    class Meta:
        model = Actor
        fields = ['id',
                  'first_name',
                  'last_name',
                  'description',
                  'day_of_birth',
                  'place_of_birth']


class ActorSimpleSerializer(serializers.ModelSerializer):
    class Meta:
        model = Actor
        fields = ['id',
                  'first_name',
                  'last_name',
                  'description',
                  'day_of_birth',
                  'place_of_birth']


class MoviesAndActorsSerializer(serializers.ModelSerializer):
    def validate(self, data):
        """
        Checks to see if the total hours filmed is a positive number
        """
        if data['total_hours_filmed'] < 0:
            raise serializers.ValidationError("The total hours filmed needs to be positive")
        return data

    movie = AllMoviesSerializer(read_only=False)
    actor = ActorSimpleSerializer(read_only=False)

    class Meta:
        model = MoviesAndActors
        fields = ['id',
                  'movie',
                  'actor',
                  'total_hours_filmed',
                  'director_notes']


class BoxOfficeSerializer(serializers.ModelSerializer):
    def validate(self, data):
        """
        Checks to see if the budget and the lifetime gross for a Box Office entry are both positive
        """
        if data['budget_in_millions'] < 0:
            raise serializers.ValidationError("The budget of the movie needs to be positive")
        if data['lifetime_gross_in_millions'] < 0:
            raise serializers.ValidationError("The lifetime gross of the movie to be positive")
        return data

    movie_referenced = AllMoviesSerializer(read_only=False)

    # title = serializers.CharField(source='movie_referenced.title')
    # release_date = serializers.DateField(source='movie_referenced.release_date')
    # duration_in_minutes = serializers.IntegerField(source='movie_referenced.duration_in_minutes')
    # description = serializers.CharField(source='movie_referenced.description')
    # pgRating = serializers.CharField(source='movie_referenced.pgRating')


    class Meta:
        model = BoxOffice
        fields = ['id',
                  'budget_in_millions',
                  'lifetime_gross_in_millions',
                  'distributor',
                  'movie_referenced']

    def create(self, validated_data):
        print(validated_data)
        movie = Movie.objects.create(
            title=validated_data['movie_referenced'].get('title'),
            release_date=validated_data['movie_referenced'].get('release_date'),
            duration_in_minutes=validated_data['movie_referenced'].get('duration_in_minutes'),
            description=validated_data['movie_referenced'].get('description'),
            pgRating=validated_data['movie_referenced'].get('pgRating')
        )

        boxOffice = BoxOffice.objects.create(
            budget_in_millions=validated_data['budget_in_millions'],
            lifetime_gross_in_millions=validated_data['lifetime_gross_in_millions'],
            distributor=validated_data['distributor'],
            movie_referenced=movie
        )
        return boxOffice
