import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';
import Product from '../../interfaces/product';

interface ProductsState {
  DashboardProduct: Product[];
  status: 'idle' | 'loading' | 'succeeded' | 'failed';
}

const URL = import.meta.env.VITE_BASE_URL;

export const fetchDashboardProduct = createAsyncThunk<Product[]>(
  'DashboardProduct',
  async (_, thunkAPI) => {
    try {
      const response = await axios.get(`${URL}/product`);
      const { data } = response;
      return data.data;
    } catch (error: any) {
      return thunkAPI.rejectWithValue(
        error?.response?.data?.message || 'Failed to fetch dashboard products'
      );
    }
  }
);

export const deleteDashboardProduct = createAsyncThunk(
  'dashboardProduct/deleteProduct',
  async (id: number) => {
    try {
      const token = localStorage.getItem('token');
      await axios.delete(`${URL}/product/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      return 'seccess';
    } catch (error) {
      return 'fail';
    }
  }
);

export const initialState: ProductsState = {
  DashboardProduct: [],
  status: 'idle',
};

const DeshboardProductsSlice = createSlice({
  name: 'products',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchDashboardProduct.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(fetchDashboardProduct.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.DashboardProduct = action.payload;
      })
      .addCase(fetchDashboardProduct.rejected, (state) => {
        state.status = 'failed';
      });
  },
});

export default DeshboardProductsSlice.reducer;
