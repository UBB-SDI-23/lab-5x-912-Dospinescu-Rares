import { ActorWithHours } from "../../actors/models/actors.models";
import { MovieWithRating } from "../../movies/models/movie.models";
import { User } from "../../users/models/user.models";

export interface MoviesAndActors {
    "id": string,
    "user": User;
    "movie": string,
    "actor": string,
    "total_hours_filmed": string,
    "director_notes": string,
}

export interface MoviesAndActorsWithPositive {
    "id": string,
    "user": User;
    "movie": MovieWithRating,
    "actor": ActorWithHours,
    "total_hours_filmed": string,
    "director_notes": string,
    "positive_reviews": string,
}

export interface AddMoviesAndActorsDto {
    movie: number,
    actor: number,
    total_hours_filmed: number,
    director_notes: string,
}

export interface UpdateMoviesAndActorsDto {
    total_hours_filmed: number,
    director_notes: string,
}