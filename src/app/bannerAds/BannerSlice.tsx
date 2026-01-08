import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import axios from 'axios';
import Product from '@/interfaces/product';

const apiUrl = `${import.meta.env.VITE_BASE_URL}`;

export const fetchBannerProducts = createAsyncThunk<Product[]>(
  'banners/fetchBannerProducts',
  async (_, thunkAPI) => {
    try {
      const response = await axios.get(
        `${apiUrl}/product/getAvailableProducts`
      );
      const { data } = response;
      return data.availableProducts.slice(0, 2);
    } catch (error: any) {
      return thunkAPI.rejectWithValue(
        error?.response?.data?.message || 'Failed to fetch banner products'
      );
    }
  }
);

export interface ProductsState {
  items: Product[];
  status: 'idle' | 'loading' | 'succeeded' | 'failed';
}

export const initialState: ProductsState = {
  items: [],
  status: 'idle',
};

const productsSlice = createSlice({
  name: 'banners',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchBannerProducts.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(fetchBannerProducts.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.items = action.payload;
      })
      .addCase(fetchBannerProducts.rejected, (state) => {
        state.status = 'failed';
      });
  },
});

export default productsSlice.reducer;
