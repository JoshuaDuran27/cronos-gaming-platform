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

export interface CartItem {
  id: number;
  cartId: number;
  game: Game;
  createdAt: string;
}

export interface CartResponse {
  cart: {
    id: number;
    userId: number;
    items: CartItem[];
    createdAt: string;
  };
  total: number;
}