import { Movie, MovieWithRating } from "../../movies/models/movie.models"
import { User } from "../../users/models/user.models";

export interface Review {
    "id": string,
    "user": User;
    "author": string,
    "date_added": string,
    "score": string,
    "description": string,
    "recommended": string,
    "movie_reviewed": string
}

export interface ReviewsWithTotal {
    "id": string,
    "user": User;
    "author": string,
    "date_added": string,
    "score": string,
    "description": string,
    "recommended": string,
    "movie_reviewed": MovieWithRating,
    "total_reviews": string
}

export interface AddReviewDto {
    movie_reviewed_id: number,
    author: string,
    score: number,
    description: string,
    recommended: string,
}

export interface UpdateReviewDto {
    author: string,
    score: number,
    description: string,
    recommended: string,
}