import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

interface AuthState {
  status: 'idle' | 'loading' | 'succeeded' | 'failed';
  error: string | null;
}

const initialState: AuthState = {
  status: 'idle',
  error: null,
};

const baseUrl = import.meta.env.VITE_BASE_URL;

export const requestPasswordReset = createAsyncThunk(
  'auth/requestPasswordReset',
  async (email: string, { rejectWithValue }) => {
    try {
      const response = await axios.post(`${baseUrl}/user/recover`, { email });
      return response.data;
    } catch (err: any) {
      const error = err.response.data;
      return rejectWithValue(typeof error === 'string' ? error : error.message);
    }
  }
);

export const resetPassword = createAsyncThunk(
  'auth/resetPassword',
  async (
    { token, password }: { token: string; password: string },
    { rejectWithValue }
  ) => {
    try {
      const response = await axios.put(
        `${baseUrl}/user/recover/confirm?recoverToken=${token}`,
        {
          password,
        }
      );
      return response.data;
    } catch (err: any) {
      const error = err.response.data;
      return rejectWithValue(typeof error === 'string' ? error : error.message);
    }
  }
);

const passwordRequest = createSlice({
  name: 'passwordRequest',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(requestPasswordReset.pending, (state) => {
        state.status = 'loading';
        state.error = null;
      })
      .addCase(requestPasswordReset.fulfilled, (state) => {
        state.status = 'succeeded';
      })
      .addCase(requestPasswordReset.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload as string;
      });
  },
});

const passwordReset = createSlice({
  name: 'passwordReset',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(resetPassword.pending, (state) => {
        state.status = 'loading';
        state.error = null;
      })
      .addCase(resetPassword.fulfilled, (state) => {
        state.status = 'succeeded';
      })
      .addCase(resetPassword.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload as string;
      });
  },
});

export const passwordResetReducer = passwordReset.reducer;
export const passwordRequestReducer = passwordRequest.reducer;
