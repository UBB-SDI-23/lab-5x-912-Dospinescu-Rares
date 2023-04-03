export interface Review {
    "id": string,
    "author": string,
    "date_added": string,
    "score": string,
    "description": string,
    "recommended": string,
    "movie_reviewed": string
}

export interface AddReviewDto {
    author: string,
    score: number,
    description: string,
    recommended: string,
    movie_reviewed: number
}