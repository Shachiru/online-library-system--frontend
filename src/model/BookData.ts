export interface Review {
    _id: string;
}

export interface BookData {
    _id?: string;
    title: string;
    author: string;
    isbn: string;
    genre: string;
    publicationYear: number;
    availability: boolean;
    reviews: string[] | Review[];
    averageRating: number;
    createdAt: string | Date;
    coverImage: string | null;
}