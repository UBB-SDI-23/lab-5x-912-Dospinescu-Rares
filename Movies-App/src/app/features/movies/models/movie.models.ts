import { ReviewsWithTotal } from "../../reviews/models/review.models";
import { User } from "../../users/models/user.models";

export interface Movie {
    "id": string;
    "title": string;
    "release_date": string;
    "duration_in_minutes": string;
    "description": string;
    "pgRating": string;
}

export interface MovieWithRating {
    "id": string;
    "user": User;
    "title": string;
    "release_date": string;
    "duration_in_minutes": string;
    "description": string;
    "pgRating": string;
    "avg_score": string;
}

export interface MovieWithReviews {
    "id": string;
    "user": User;
    "title": string;
    "release_date": string;
    "duration_in_minutes": string;
    "description": string;
    "pgRating": string;
    "reviews": ReviewsWithTotal[];
    "avg_score": string;
}
 
export interface AddMovieDto {
    title: string;
    release_date: string;
    duration_in_minutes: number;
    description: string;
    pgRating: string;
}