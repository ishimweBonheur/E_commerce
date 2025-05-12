import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';
import Cart from '@/interfaces/cart';
import { RootState } from '../../app/store';

interface CartState {
  cartItems: Cart[];
  loading: boolean;
  error: string | null;
}

const initialState: CartState = {
  cartItems: [],
  loading: false,
  error: null,
};

const baseUrl = import.meta.env.VITE_BASE_URL;

interface Payload {
  cartItems: Cart[];
}

interface AddPayload {
  cartItem: Cart;
}

export const fetchCartItems = createAsyncThunk(
  'cart/fetchCartItems',
  async (_, { rejectWithValue }) => {
    try {
      const tokenFromStorage = localStorage.getItem('token');
      if (!tokenFromStorage) {
        return rejectWithValue('Please login to view your cart');
      }

      const response = await axios.get<Payload>(`${baseUrl}/cart`, {
        headers: {
          Authorization: `Bearer ${tokenFromStorage}`,
        },
      });
      return response.data.cartItems;
    } catch (error) {
      return rejectWithValue(
        (error as any).response?.data?.message || 'Failed to fetch cart items'
      );
    }
  }
);

export const updateCartItemQuantity = createAsyncThunk(
  'cart/updateCartItemQuantity',
  async (
    { itemId, quantity }: { itemId: number; quantity: number },
    { rejectWithValue }
  ) => {
    try {
      const tokenFromStorage = localStorage.getItem('token');
      if (!tokenFromStorage) {
        return rejectWithValue('Please login to update cart');
      }

      await axios.patch<Payload>(
        `${baseUrl}/cart/${itemId}`,
        { quantity },
        {
          headers: {
            Authorization: `Bearer ${tokenFromStorage}`,
          },
        }
      );
      return { itemId, quantity };
    } catch (error) {
      return rejectWithValue(
        (error as any).response?.data?.message || 'Failed to update cart item'
      );
    }
  }
);

export const removeCartItem = createAsyncThunk(
  'cart/removeCartItem',
  async (itemId: number, { rejectWithValue }) => {
    try {
      if (!itemId) {
        return rejectWithValue('Invalid cart item');
      }

      const tokenFromStorage = localStorage.getItem('token');
      if (!tokenFromStorage) {
        return rejectWithValue('Please login to remove items from cart');
      }

      await axios.delete(`${baseUrl}/cart/${itemId}`, {
        headers: {
          Authorization: `Bearer ${tokenFromStorage}`,
        },
      });
      return itemId;
    } catch (error) {
      return rejectWithValue(
        (error as any).response?.data?.message || 'Failed to remove cart item'
      );
    }
  }
);

export const addCartItem = createAsyncThunk(
  'cart/addCartItem',
  async (
    { productId, quantity }: { productId: number; quantity: number },
    { rejectWithValue }
  ) => {
    try {
      const tokenFromStorage = localStorage.getItem('token');
      if (!tokenFromStorage) {
        return rejectWithValue('Please login to add items to cart');
      }

      const response = await axios.post<AddPayload>(
        `${baseUrl}/cart`,
        { productId, quantity },
        {
          headers: {
            Authorization: `Bearer ${tokenFromStorage}`,
          },
        }
      );
      return response.data.cartItem;
    } catch (error) {
      return rejectWithValue(
        (error as any).response?.data?.message || 'Failed to add cart item'
      );
    }
  }
);

const cartSlice = createSlice({
  name: 'cartItems',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchCartItems.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchCartItems.fulfilled, (state, action) => {
        state.loading = false;
        state.cartItems = action.payload;
      })
      .addCase(fetchCartItems.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Failed to fetch cart items';
      })
      .addCase(addCartItem.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(addCartItem.fulfilled, (state, action) => {
        state.loading = false;
        state.cartItems = [...state.cartItems, action.payload];
      })
      .addCase(addCartItem.rejected, (state, action) => {
        state.loading = false;
        state.error =
          action.error.message || 'Failed to update cart item quantity';
      })
      .addCase(updateCartItemQuantity.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateCartItemQuantity.fulfilled, (state, action) => {
        const index = state.cartItems.findIndex(
          (item) => item.id === action.payload.itemId
        );
        const update = state.cartItems[index] as Cart;
        update.quantity = action.payload.quantity;
        state.loading = false;
        state.cartItems = state.cartItems.splice(index, 1, update);
      })
      .addCase(updateCartItemQuantity.rejected, (state, action) => {
        state.loading = false;
        state.error =
          action.error.message || 'Failed to update cart item quantity';
      })
      .addCase(removeCartItem.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(removeCartItem.fulfilled, (state, action) => {
        state.loading = false;
        state.cartItems = state.cartItems.filter(
          (item) => item.id !== action.payload
        );
      })
      .addCase(removeCartItem.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Failed to remove cart item';
      });
  },
});

export const selectCartItems = (state: RootState) => state.cartItems.cartItems;
export default cartSlice.reducer;
