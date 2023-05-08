export interface Actor {
    "id": string;
    "day_of_birth": string;
    "description": string;
    "first_name": string;
    "last_name": string;
    "place_of_birth": string;
}

export interface ActorWithHours {
    "id": string;
    "day_of_birth": string;
    "description": string;
    "first_name": string;
    "last_name": string;
    "place_of_birth": string;
    "total_hours_filmed": number;
}

export interface AddActorDto {
    first_name: string;
    last_name: string;
    description: string;
    day_of_birth: string;
    place_of_birth: string;
}