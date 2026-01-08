import { createAsyncThunk, createSlice, PayloadAction } from '@reduxjs/toolkit';
import axios from 'axios';
import { Product } from '@/types/Product';
import User from '@/types/User';

interface Payload {
  message: string;
  data: Product[];
}

interface ProductsState {
  isLoading: boolean;
  products: Product[];
  allProducts: Product[];
  status: 'idle' | 'loading' | 'succeeded' | 'failed';
  error: string | null;
}

const initialState: ProductsState = {
  isLoading: false,
  products: [
    {
      id: 1,
      name: 'Product name',
      shortDesc:
        'Ullamco tempor duis mollit ullamco incididunt culpa elit commodo.',
      salesPrice: 230,
      regularPrice: 280,
      averageRating: 4.7,
      image: 'path_to_image',
      gallery: ['path_to_image', 'path_to_image'],
      category: {
        id: 1,
        name: 'Category name',
        description: 'Category description',
      },
      longDesc: 'Long description',
      quantity: 10,
      tags: ['tag1', 'tag2'],
      type: 'Simple',
      isAvailable: true,
      reviews: [],
      vendor: {
        id: 1,
        firstName: 'Vendor',
        lastName: 'Name',
        email: 'example@gmail.com',
      } as User,
      isFeatured: false,
    },
  ],
  allProducts: [],
  status: 'idle',
  error: null,
};

export const fetchProducts = createAsyncThunk(
  'products/fetchProducts',
  async (_, thunkAPI) => {
    try {
      const response = await axios.get<Payload>(
        `${import.meta.env.VITE_BASE_URL}/product`
      );
      return response.data.data;
    } catch (error: any) {
      return thunkAPI.rejectWithValue(
        error?.response?.data?.message || 'Failed to fetch products'
      );
    }
  }
);

const allProductSlice = createSlice({
  name: 'allProducts',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchProducts.pending, (state) => {
        state.status = 'loading';
        state.error = null;
      })
      .addCase(
        fetchProducts.fulfilled,
        (state, action: PayloadAction<Product[]>) => {
          state.status = 'succeeded';
          state.allProducts = action.payload;
        }
      )
      .addCase(fetchProducts.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.error.message || 'Failed to fetch Products';
      });
  },
});

export default allProductSlice.reducer;
