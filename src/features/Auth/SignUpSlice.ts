import { createSlice, PayloadAction, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';
import { showSuccessToast, showErrorToast } from '@/utils/ToastConfig';

interface SignUpState {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  userType: 'Vendor' | 'Buyer';
  loading: boolean;
  error: string | null;
}

const initialState: SignUpState = {
  firstName: '',
  lastName: '',
  email: '',
  password: '',
  userType: 'Buyer',
  loading: false,
  error: null,
};
const apiUrl = `${import.meta.env.VITE_BASE_URL}/user/register`;

export const registerUser = createAsyncThunk(
  'signUp/registerUser',
  async (userData: Omit<SignUpState, 'loading' | 'error'>, { rejectWithValue }) => {
    try {
      console.log('Registration payload:', userData);
      const response = await axios.post(apiUrl, userData);
      return response.data;
    } catch (error: any) {
      console.log('Registration error:', error.response?.data);
      const errorMessage = error.response?.data?.message || error.message || 'Registration failed';
      showErrorToast(errorMessage);
      return rejectWithValue(errorMessage);
    }
  }
);

const signUpSlice = createSlice({
  name: 'signUp',
  initialState,
  reducers: {
    setFirstName: (state, action: PayloadAction<string>) => {
      state.firstName = action.payload;
    },
    setLastName: (state, action: PayloadAction<string>) => {
      state.lastName = action.payload;
    },
    setEmail: (state, action: PayloadAction<string>) => {
      state.email = action.payload;
    },
    setPassword: (state, action: PayloadAction<string>) => {
      state.password = action.payload;
    },
    setUserType: (state, action: PayloadAction<'Vendor' | 'Buyer'>) => {
      state.userType = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(registerUser.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(registerUser.fulfilled, (state) => {
        state.loading = false;
        showSuccessToast(
          'Registration successful! Please check your Email to confirm.'
        );
      })
      .addCase(registerUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string || 'Something went wrong';
        showErrorToast(state.error);
      });
  },
});

export const { setFirstName, setLastName, setEmail, setPassword, setUserType } =
  signUpSlice.actions;

export default signUpSlice.reducer;
