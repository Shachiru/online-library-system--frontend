export interface BookData {
     _id: string;
     title: string;
     author: string;
     isbn: string;
     genre: string;
     publicationYear: number;
     availability: boolean;
     reviews: string[];
     averageRating: number;
     createdAt: string;
     coverImage?: string;
}