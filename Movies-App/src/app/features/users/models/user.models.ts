export interface User {
    "id": string;
    "username": string;
    "email": string;
    "role": string;
}

export interface UpdateUserDto {
    username: string,
    email: string,
    role: string,
}

export interface UserDto {
    username: string,
    email: string,
    password: string,
}

export interface UserProfile {
    "id": string;
    "user": User;
    "bio": string;
    "location": string;
    "birthday": string;
    "gender": string;
    "marital_status": string;
    "movies_added": string;
    "reviews_added": string;
    "box_offices_added": string;
    "actors_added": string;
    "movies_and_actors_added": string;
}

export interface UpdateUserProfileDto {
    bio: string,
    location: string,
    birthday: string,
    gender: string,
    marital_status: string,
}