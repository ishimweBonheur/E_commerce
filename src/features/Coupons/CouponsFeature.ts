import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';
import { showSuccessToast } from '@/utils/ToastConfig';
import Product from '@/interfaces/product';

interface Coupon {
  id: number;
  code: string;
  description: string;
  percentage: number;
  expirationDate: string;
  status: string;
  applicableProducts: Product[];
  vendor: {
    id: number;
    firstName: string;
    lastName: string;
  };
}

interface CouponsState {
  coupons: Coupon[];
  loading: boolean;
  error: string | null;
}

const initialState: CouponsState = {
  coupons: [],
  loading: false,
  error: null,
};

export const fetchCoupons = createAsyncThunk(
  'coupons/fetchCoupons',
  async () => {
    const response = await axios.get(
      `${import.meta.env.VITE_BASE_URL}/coupons`
    );
    return response.data;
  }
);
export const fetchMyCoupons = createAsyncThunk(
  'coupons/fetchMyCoupons',
  async () => {
    const token = localStorage.getItem('token');
    const response = await axios.get(
      `${import.meta.env.VITE_BASE_URL}/coupons/mine`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );
    return response.data;
  }
);

interface NewCoupon {
  description: string;
  percentage: number;
  expirationDate: string;
  applicableProducts: number[];
}
interface UpdatedCoupon {
  id: number;
  description: string;
  percentage: number;
  expirationDate: string;
  applicableProducts: number[];
}

export const createCoupon = createAsyncThunk(
  'coupons/createCoupon',
  async ({ newCoupon, token }: { newCoupon: NewCoupon; token: string }) => {
    const response = await axios.post(
      `${import.meta.env.VITE_BASE_URL}/coupons`,
      newCoupon,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );
    return response.data;
  }
);

export const updateCoupon = createAsyncThunk(
  'coupons/updateCoupon',
  async (updatedCoupon: UpdatedCoupon) => {
    const token = localStorage.getItem('token');
    const response = await axios.put(
      `${import.meta.env.VITE_BASE_URL}/coupons/${updatedCoupon.id}`,
      updatedCoupon,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );
    return response.data;
  }
);

export const deleteCoupon = createAsyncThunk(
  'coupons/deleteCoupon',
  async ({ couponId, token }: { couponId: number; token: string }) => {
    const response = await axios.delete(
      `${import.meta.env.VITE_BASE_URL}/coupons/${couponId}`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );
    return response.data;
  }
);

const couponsSlice = createSlice({
  name: 'coupons',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchCoupons.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchCoupons.fulfilled, (state, action) => {
        state.loading = false;
        state.coupons = action.payload;
        state.error = null;
      })
      .addCase(fetchCoupons.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Failed to fetch coupons';
      })
      .addCase(fetchMyCoupons.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchMyCoupons.fulfilled, (state, action) => {
        state.loading = false;
        state.coupons = action.payload;
        state.error = null;
      })
      .addCase(fetchMyCoupons.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Failed to fetch coupons';
      })
      .addCase(createCoupon.pending, (state) => {
        state.loading = true;
      })
      .addCase(createCoupon.fulfilled, (state, action) => {
        state.loading = false;
        state.coupons.push(action.payload);
        showSuccessToast(action.payload.message);
      })
      .addCase(createCoupon.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Failed to create coupon';
      })
      .addCase(updateCoupon.pending, (state) => {
        state.loading = true;
      })
      .addCase(updateCoupon.fulfilled, (state, action) => {
        const index = state.coupons.findIndex(
          (coupon) => coupon.id === action.payload.id
        );
        if (index !== -1) {
          state.coupons[index] = action.payload;
        }
        showSuccessToast('Coupon updated successfully');
      })
      .addCase(updateCoupon.rejected, (state, action) => {
        state.error = action.error.message || 'Failed to update coupon';
      })
      .addCase(deleteCoupon.fulfilled, (state, action) => {
        state.coupons = state.coupons.filter(
          (coupon) => coupon.id !== action.payload
        );
        showSuccessToast(action.payload.message);
      })
      .addCase(deleteCoupon.rejected, (state, action) => {
        state.error = action.error.message || 'Failed to delete coupon';
      });
  },
});

export const selectCoupons = (state: { coupons: CouponsState }) =>
  state.coupons;
export default couponsSlice.reducer;
