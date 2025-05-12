import User from './User';

export interface Category {
  id: number;
  name: string;
  description: string;
  icon?: string;
}

export interface Review {
  id: number;
  content: string;
  rating: number;
  user: User;
  product: Product;
}

export interface Product {
  id: number;
  name: string;
  image: string;
  gallery: string[];
  shortDesc: string;
  longDesc: string;
  category: Category;
  quantity: number;
  regularPrice: number;
  salesPrice: number;
  tags: string[];
  type: 'Simple' | 'Grouped' | 'Variable';
  isAvailable: boolean;
  averageRating: number;
  reviews: Review[];
  vendor: User;
  isFeatured: boolean;
}
