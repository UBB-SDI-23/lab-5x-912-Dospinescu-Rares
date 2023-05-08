import { MovieWithRating } from "../../movies/models/movie.models";

export interface BoxOffice {
    "id": string,
    "budget_in_millions": string,
    "lifetime_gross_in_millions": string,
    "distributor": string,
    "movie_referenced": string,
    "description": string,
}

export interface BoxOfficeWithHighestScore {
    "id": string,
    "budget_in_millions": string,
    "lifetime_gross_in_millions": string,
    "distributor": string,
    "movie_referenced": MovieWithRating,
    "description": string,
    "highest_score": string,
}

export interface AddBoxOfficeDto {
    budget_in_millions: number,
    lifetime_gross_in_millions: number,
    distributor: string,
    movie_referenced: number,
    description: string,
}

export interface UpdateBoxOfficeDto {
    budget_in_millions: number,
    lifetime_gross_in_millions: number,
    distributor: string,
    description: string,
}