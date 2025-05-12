import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import axios from 'axios';
import Order from '@/interfaces/order';
import { RootState, store } from '../../app/store';

interface OrdersState {
  orders: Order[];
  loading: boolean;
  error: string | null;
}

const initialState: OrdersState = {
  orders: [],
  loading: false,
  error: null,
};

const baseUrl = import.meta.env.VITE_BASE_URL;

export const fetchOrders = createAsyncThunk('orders/fetchOrders', async () => {
  const tokenFromStorage = localStorage.getItem('token') || '';
  const response = await axios.get(`${baseUrl}/checkout/getall-order`, {
    headers: {
      Authorization: `Bearer ${tokenFromStorage}`,
    },
  });
  const res = response.data.orders;
  const orders = res.map((order: any) => {
    return {
      ...order,
      deliveryInfo: {
        address: JSON.parse(order.deliveryInfo).address,
        city: JSON.parse(order.deliveryInfo).city,
        zip: JSON.parse(order.deliveryInfo).zip,
      },
    };
  });

  const { signIn } = store.getState();

  if (signIn.user?.userType.name === 'Admin') {
    return orders;
  }
  if (signIn.user?.userType.name === 'Vendor') {
    const filteredOrders: Order[] = [];
    /* eslint-disable no-restricted-syntax */
    for (const order of orders) {
      const newDetails = [];
      /* eslint-disable no-restricted-syntax */
      for (const orderDetail of order.orderDetails) {
        if (orderDetail.product.vendor.id === signIn.user.id) {
          newDetails.push(orderDetail);
        }
      }

      if (newDetails.length > 0) {
        filteredOrders.push({ ...order, orderDetails: newDetails });
      }
    }

    return filteredOrders;
  }
  return orders;
});

const ordersSlice = createSlice({
  name: 'orders',
  initialState,
  reducers: {
    cancelOrder: (state, action: PayloadAction<number>) => {
      const orderId = action.payload;
      const orderToCancel = state.orders.find((order) => order.id === orderId);

      if (orderToCancel) {
        const tokenFromStorage = localStorage.getItem('token') || '';
        axios.delete(`${baseUrl}/checkout/cancel-order/${orderId}`, {
          headers: {
            Authorization: `Bearer ${tokenFromStorage}`,
          },
        });
      }
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchOrders.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchOrders.fulfilled, (state, action) => {
        state.loading = false;
        state.orders = action.payload;
      })
      .addCase(fetchOrders.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Failed to fetch orders';
      });
  },
});

export const { cancelOrder } = ordersSlice.actions;

export const selectOrders = (state: RootState) => state.orders;
export default ordersSlice.reducer;
