import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';
import Product from '../../interfaces/product';

interface ProductsState {
  availableProduct: Product[];
  status: 'idle' | 'loading' | 'succeeded' | 'failed';
}

const URL = import.meta.env.VITE_BASE_URL;

export const fetchAvailableProducts = createAsyncThunk<Product[]>(
  'products/fetchProducts',
  async (_, thunkAPI) => {
    try {
      const response = await axios.get(`${URL}/product/getAvailableProducts`);
      const { data } = response;
      return data.availableProducts;
    } catch (error: any) {
      return thunkAPI.rejectWithValue(
        error?.response?.data?.message || 'Failed to fetch available products'
      );
    }
  }
);

export const initialState: ProductsState = {
  availableProduct: [],
  status: 'idle',
};

const productsSlice = createSlice({
  name: 'products',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchAvailableProducts.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(fetchAvailableProducts.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.availableProduct = action.payload;
      })
      .addCase(fetchAvailableProducts.rejected, (state) => {
        state.status = 'failed';
      });
  },
});

export default productsSlice.reducer;
