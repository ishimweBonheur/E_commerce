import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import axios from 'axios';

interface SubscribeState {
  email: string;
  status: 'idle' | 'loading' | 'succeeded' | 'failed';
  error: string | null;
}

const initialState: SubscribeState = {
  email: '',
  status: 'idle',
  error: null as string | null,
};

const subscribeUrl = `${import.meta.env.VITE_BASE_URL}/subscribe`;

export const submitForm = createAsyncThunk(
  'form/submitForm',
  async (subdata: Omit<SubscribeState, 'status' | 'error'>, { rejectWithValue }) => {
    try {
      console.log('Sending request to:', subscribeUrl);
      console.log('Request data:', { email: subdata.email });
      const response = await axios.post(subscribeUrl, { email: subdata.email });
      console.log('Response:', response.data);
      return response.data;
    } catch (error) {
      console.log('Error details:', error);
      if (axios.isAxiosError(error) && error.response) {
        console.log('Error response data:', error.response.data);
        if (error.response.data.errors) {
          return rejectWithValue(error.response.data.errors[0].msg || 'Failed to subscribe');
        }
        return rejectWithValue(error.response.data.message || 'Failed to subscribe');
      }
      return rejectWithValue('An unexpected error occurred');
    }
  }
);

const subscribeSlice = createSlice({
  name: 'form',
  initialState,
  reducers: {
    setEmail: (state, action: PayloadAction<string>) => {
      state.email = action.payload;
    },
    resetState() {
      return initialState;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(submitForm.pending, (state) => {
        state.status = 'loading';
        state.error = null;
      })
      .addCase(submitForm.fulfilled, (state) => {
        state.status = 'succeeded';
        state.email = '';
        state.error = null;
      })
      .addCase(submitForm.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload as string || 'Failed to subscribe';
        setTimeout(() => {
          state.error = null;
        }, 3000);
      });
  },
});

export const { setEmail, resetState } = subscribeSlice.actions;
export default subscribeSlice.reducer;
