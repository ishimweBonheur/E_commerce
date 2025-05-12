import Vendor from '@/interfaces/Vendor';
import Category from '@/interfaces/category';

export default interface Product {
  id: number;
  name: string;
  image: string;
  gallery: string[];
  shortDesc: string;
  longDesc: string;
  quantity: number;
  regularPrice: number;
  salesPrice: number;
  tags: string[];
  type: string;
  isAvailable: boolean;
  isFeatured: boolean;
  averageRating: number;
  createdAt: string;
  updatedAt: string;
  category: Category;
  vendor: Vendor | null;
}
