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
  async (subdata: Omit<SubscribeState, 'status' | 'error'>) => {
    const response = await axios.post(subscribeUrl, subdata);
    return response.data;
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
      })
      .addCase(submitForm.fulfilled, (state) => {
        state.status = 'succeeded';
        state.email = '';
      })
      .addCase(submitForm.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.error.message ?? 'Failed to send Data';
        setTimeout(() => {
          state.error = null;
        }, 3000);
      });
  },
});

export const { setEmail, resetState } = subscribeSlice.actions;
export default subscribeSlice.reducer;
