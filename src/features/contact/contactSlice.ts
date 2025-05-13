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

const API_BASE_URL = import.meta.env.VITE_BASE_URL;
console.log('API_BASE_URL:', API_BASE_URL); // Debug log

export const sendMessage = createAsyncThunk(
  'contact/sendMessage',
  async (messageData: {
    name: string;
    phoneNumber: string;
    email: string;
    message: string;
  }, { rejectWithValue }) => {
    try {
      const url = `${API_BASE_URL}/contact`;
      console.log('Request URL:', url); // Debug log
      console.log('Request Data:', messageData); // Debug log
      const response = await axios.post(url, messageData);
      return response.data;
    } catch (error: any) {
      console.error('Server Error:', error.response?.data); // Debug log
      return rejectWithValue(
        error.response?.data?.message || 'Failed to send message'
      );
    }
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
        state.error = action.payload as string || 'Failed to send message';
        state.success = false;
      });
  },
});

export const { resetStatus } = contactSlice.actions;
export default contactSlice.reducer;
