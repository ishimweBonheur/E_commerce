import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';
import { Product } from '@/types/Product';

interface BestSellingProductsState {
  bestSellingProduct: Product[];
  status: 'idle' | 'loading' | 'succeeded' | 'failed';
}

const URL = import.meta.env.VITE_BASE_URL;

export const fetchBestSellingProducts = createAsyncThunk<
  Product[],
  void,
  { rejectValue: string }
>('bestSellingProducts/fetchBestSellingProducts', async (_, thunkAPI) => {
  try {
    const response = await axios.get(`${URL}/product/bestselling`);
    return response.data;
  } catch (error: any) {
    return thunkAPI.rejectWithValue(
      error?.response?.data?.message || 'Failed to fetch best-selling products'
    );
  }
});

const initialState: BestSellingProductsState = {
  bestSellingProduct: [],
  status: 'idle',
};

const bestSellingProductSlice = createSlice({
  name: 'bestSellingProducts',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchBestSellingProducts.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(fetchBestSellingProducts.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.bestSellingProduct = action.payload;
      })
      .addCase(fetchBestSellingProducts.rejected, (state) => {
        state.status = 'failed';
      });
  },
});

export default bestSellingProductSlice.reducer;
