import { createAsyncThunk, createSlice, PayloadAction } from '@reduxjs/toolkit';
import axios from 'axios';

export interface Buyer {
  id: number;
  firstName: string;
  lastName: string;
  email: string;
  userType: {
    id: string;
    name: string;
    permissions: string[];
  };
  googleId: string | null;
  facebookId: string | null;
  picture: string;
  provider: string | null;
  isVerified: boolean;
  status: string;
  twoFactorCode: string | null;
  updatedAt: string;
  password: string;
}

const buyerUrl = `${import.meta.env.VITE_BASE_URL}/user/getAllUsers`;

export const fetchBuyers = createAsyncThunk<
  Buyer[],
  void,
  { rejectValue: string }
>('buyers/fetchBuyers', async (_, thunkAPI) => {
  try {
    const response = await axios.get(buyerUrl);
    const { data } = response;
    return data.users;
  } catch (error) {
    if (axios.isAxiosError(error) && error.response) {
      return thunkAPI.rejectWithValue(error.response.data.message);
    }
    return thunkAPI.rejectWithValue('An unknown error occurred');
  }
});

export interface BuyerState {
  buyers: Buyer[];
  status: 'idle' | 'loading' | 'succeeded' | 'failed';
  error: string | null;
}

export const initialState: BuyerState = {
  buyers: [],
  status: 'idle',
  error: null,
};

const buyerSlice = createSlice({
  name: 'buyers',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchBuyers.pending, (state) => {
        state.status = 'loading';
        state.error = null;
      })
      .addCase(
        fetchBuyers.fulfilled,
        (state, action: PayloadAction<Buyer[]>) => {
          state.status = 'succeeded';
          state.buyers = action.payload;
        }
      )
      .addCase(
        fetchBuyers.rejected,
        (state, action: PayloadAction<string | undefined>) => {
          state.status = 'failed';
          state.error = action.payload || 'Failed to fetch buyers';
        }
      );
  },
});

export default buyerSlice.reducer;
