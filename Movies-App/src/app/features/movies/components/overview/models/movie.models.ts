export interface Movie {
    "id": string;
    "title": string;
    "release_date": string;
    "duration_in_minutes": string;
    "description": string;
    "pgRating": string;
}

export interface MovieRating {
    "id": string;
    "title": string;
    "release_date": string;
    "duration_in_minutes": string;
    "description": string;
    "pgRating": string;
    "overall_rating": string;
}

export interface AddMovieDto {
    title: string;
    release_date: string;
    duration_in_minutes: number;
    description: string;
    pgRating: string;
}