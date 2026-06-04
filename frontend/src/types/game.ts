export interface Category {
  id: number;
  name: string;
  description: string;
}

export interface Game {
  id: number;
  title: string;
  description: string;
  price: number;
  imageUrl: string;
  developer: string;
  publisher: string;
  releaseDate: string;
  category: Category;
  createdAt: string;
}