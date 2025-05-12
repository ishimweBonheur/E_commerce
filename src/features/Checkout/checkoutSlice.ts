import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import axios from 'axios';
import { RootState } from '../../app/store';
import { Checkout } from '@/interfaces/checkout';
import Order from '@/interfaces/order';
import { showErrorToast, showSuccessToast } from '@/utils/ToastConfig';

export interface CheckoutState {
  checkout: Order;
  loading: boolean;
  error: string | null;
  paying: boolean;
}

const initialOrder: Order = {
  id: -1,
  totalAmount: 0,
  status: 'Pending',
  couponCode: '',
  deliveryInfo: {
    address: '123 Main St',
    city: 'Anytown',
    zip: '12345',
  },
  country: 'US',
  paymentInfo: null,
  trackingNumber: 'Tr280585',
  createdAt: '2024-07-22T01:48:05.301Z',
  updatedAt: '2024-07-22T11:01:20.291Z',
  paid: true,
  orderDetails: [
    {
      id: 41,
      quantity: 2,
      price: 160,
    },
  ],
};

interface MomoPaymentParams {
  momoNumber: string;
  orderId: number;
}

const initialState: CheckoutState = {
  checkout: initialOrder,
  loading: false,
  paying: false,
  error: null,
};

const baseUrl = import.meta.env.VITE_BASE_URL;

export const placeOrder = createAsyncThunk(
  'order/create',
  async (order: Checkout) => {
    const tokenFromStorage = localStorage.getItem('token') || '';
    const response = await axios.post(
      `${baseUrl}/checkout`,
      { ...order },
      {
        headers: {
          Authorization: `Bearer ${tokenFromStorage}`,
        },
      }
    );
    return response.data.order;
  }
);

export const makeMomoPayment = createAsyncThunk(
  'payment/momoPayment',
  async ({ momoNumber, orderId }: MomoPaymentParams, { rejectWithValue }) => {
    try {
      const tokenFromStorage = localStorage.getItem('token') || '';
      const response = await axios.post(
        `${import.meta.env.VITE_BASE_URL}/buyer/momoPay`,
        {
          momoNumber,
          orderId,
        },
        {
          headers: {
            Authorization: `Bearer ${tokenFromStorage}`,
          },
        }
      );
      showSuccessToast('Transaction successful');
      return response.data;
    } catch (error) {
      if (axios.isAxiosError(error)) {
        const errorMessage = error.response?.data?.message || 'Payment failed';
        showErrorToast(errorMessage);
        return rejectWithValue(errorMessage);
      }
      showErrorToast('Payment failed');
      return rejectWithValue('Payment failed');
    }
  }
);

export const getOrders = createAsyncThunk('order/get', async () => {
  const tokenFromStorage = localStorage.getItem('token') || '';
  const response = await axios.get(`${baseUrl}/checkout/getall-order`, {
    headers: {
      Authorization: `Bearer ${tokenFromStorage}`,
    },
  });
  return {
    ...response.data,
    deliveryInfo: JSON.parse(response.data[0].deliveryInfo),
  };
});

export const makePayment = createAsyncThunk(
  'order/pay',
  async (orderId: number) => {
    const tokenFromStorage = localStorage.getItem('token') || '';
    const response = await axios.post(
      `${baseUrl}/buyer/payment`,
      {
        token: 'tok_visa',
        orderId,
      },
      {
        headers: {
          Authorization: `Bearer ${tokenFromStorage}`,
        },
      }
    );

    return response.data;
  }
);

const checkoutSlice = createSlice({
  name: 'checkout',
  initialState,
  reducers: {
    updateDeliveryInfo: (
      state,
      action: PayloadAction<Partial<Checkout['deliveryInfo']>>
    ) => {
      state.checkout.deliveryInfo = {
        ...state.checkout.deliveryInfo,
        ...action.payload,
      };
    },
    updateCouponCode: (state, action: PayloadAction<string>) => {
      state.checkout.couponCode = action.payload;
    },
    updateStatus: (state, action: PayloadAction<boolean>) => {
      state.paying = action.payload;
    },
    updateEmail: (state, action: PayloadAction<string>) => {
      state.checkout.email = action.payload;
    },
    updateFirstName: (state, action: PayloadAction<string>) => {
      state.checkout.firstName = action.payload;
    },
    updateLastName: (state, action: PayloadAction<string>) => {
      state.checkout.lastName = action.payload;
    },
    resetState: () => {
      return initialState;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(placeOrder.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(placeOrder.fulfilled, (state, action: PayloadAction<Order>) => {
        state.loading = false;
        state.checkout = { ...state.checkout, ...action.payload };
      })
      .addCase(placeOrder.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Failed to place order';
      })
      .addCase(getOrders.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getOrders.fulfilled, (state, action: PayloadAction<Order[]>) => {
        state.loading = false;
        state.checkout = { ...state.checkout, ...action.payload[0] };
      })
      .addCase(getOrders.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Failed to fetch orders';
      })
      .addCase(makePayment.pending, (state) => {
        state.loading = true;
        state.error = null;
        state.paying = true;
      })
      .addCase(makePayment.fulfilled, (state) => {
        state.loading = false;
      })
      .addCase(makePayment.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Payment failed';
      });
  },
});

export const {
  updateDeliveryInfo,
  updateCouponCode,
  updateEmail,
  updateFirstName,
  updateLastName,
  updateStatus,
  resetState,
} = checkoutSlice.actions;

export const selectCheckout = (state: RootState) => state.checkout;

export default checkoutSlice.reducer;
