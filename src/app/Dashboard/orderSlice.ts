import { PayloadAction, createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import axios from 'axios';

interface Order {
  user: object;
  totalAmount: number;
  deliveryInfo: object;
  trackingNumber: string;
  orderDetails: [];
  paymentInfo: string | null;
  paid: boolean;
}

const orderUrl = `${import.meta.env.VITE_BASE_URL}/checkout/getall-order`;

export const fetchOrders = createAsyncThunk<
  Order[],
  void,
  { rejectValue: string }
>('Order/fetchOrders', async (_, thunkAPI) => {
  try {
    const token = localStorage.getItem('token');
    const config = {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    };

    const response = await axios.get(orderUrl, config);
    const { data } = response;
    return data.orders;
  } catch (error) {
    if (axios.isAxiosError(error) && error.response) {
      return thunkAPI.rejectWithValue(error.response.data.message);
    }
    return thunkAPI.rejectWithValue('An unknown error occurred');
  }
});

export interface BuyerState {
  order: Order[];
  status: 'idle' | 'loading' | 'succeeded' | 'failed';
  error: string | null;
}

const initialState: BuyerState = {
  order: [],
  status: 'idle',
  error: null,
};

const buyerSlice = createSlice({
  name: 'buyers',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchOrders.pending, (state) => {
        state.status = 'loading';
        state.error = null;
      })
      .addCase(
        fetchOrders.fulfilled,
        (state, action: PayloadAction<Order[]>) => {
          state.status = 'succeeded';
          state.order = action.payload;
        }
      )
      .addCase(
        fetchOrders.rejected,
        (state, action: PayloadAction<string | undefined>) => {
          state.status = 'failed';
          state.error = action.payload || 'Failed to fetch orders';
          if (action.payload === 'Unauthorized') {
            state.error = action.payload || 'Failed to fetch buyers';
          }
        }
      );
  },
});

export default buyerSlice.reducer;
