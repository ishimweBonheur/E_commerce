import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

interface ContactState {
  loading: boolean;
  error: string | null;
  success: boolean;
}

const initialState: ContactState = {
  loading: false,
  error: null,
  success: false,
};

const API_BASE_URL = import.meta.env.VITE_API_URL;

export const sendMessage = createAsyncThunk(
  'contact/sendMessage',
  async (messageData: {
    name: string;
    phoneNumber: string;
    email: string;
    message: string;
  }) => {
    const response = await axios.post(`${API_BASE_URL}/contact`, messageData);
    return response.data;
  }
);

const contactSlice = createSlice({
  name: 'contact',
  initialState,
  reducers: {
    resetStatus: (state) => {
      state.loading = false;
      state.error = null;
      state.success = false;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(sendMessage.pending, (state) => {
        state.loading = true;
        state.error = null;
        state.success = false;
      })
      .addCase(sendMessage.fulfilled, (state) => {
        state.loading = false;
        state.success = true;
      })
      .addCase(sendMessage.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Failed to send message';
        state.success = false;
      });
  },
});

export const { resetStatus } = contactSlice.actions;
export default contactSlice.reducer;
