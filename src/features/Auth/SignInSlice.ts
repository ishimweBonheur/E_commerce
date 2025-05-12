import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import axios from 'axios';
import { jwtDecode } from 'jwt-decode';
import { showErrorToast, showSuccessToast } from '@/utils/ToastConfig';

interface User {
  id: number;
  firstName: string;
  lastName: string;
  email: string;
  picture: string;
  userType: {
    id: number;
    name: string;
    permissions: string[];
  };
}

export interface SignInState {
  token: string | null;
  user: User | null;
  loading: boolean;
  error: string | null;
  message: string | null;
  role: string | null;
  needsVerification: boolean;
  needs2FA: boolean;
  vendor: {
    id: number | null;
    email: string | null;
  };
}

interface DecodedToken {
  user: User;
}

interface LoginResponse {
  token: string;
  message: string;
  user: {
    id: number;
    email: string;
  };
}

interface Credentials {
  email: string;
  password: string;
}

interface Arguments {
  id: string | undefined;
  codes: number;
}
const tokenFromStorage = localStorage.getItem('token');

let userFromToken: User | null = null;

if (tokenFromStorage) {
  try {
    const decodedToken = jwtDecode<DecodedToken>(tokenFromStorage);
    userFromToken = {
      id: decodedToken.user.id,
      firstName: decodedToken.user.firstName,
      lastName: decodedToken.user.lastName,
      email: decodedToken.user.email,
      picture: decodedToken.user.picture,
      userType: decodedToken.user.userType,
    };
  } catch (error) {
    localStorage.removeItem('token');
  }
}

export const initialState: SignInState = {
  token: tokenFromStorage,
  user: userFromToken,
  loading: false,
  error: null,
  message: null,
  role: null,
  needsVerification: false,
  needs2FA: false,
  vendor: {
    id: null,
    email: null,
  },
};

const apiUrl = `${import.meta.env.VITE_BASE_URL}/user/login`;
export const loginUser = createAsyncThunk<LoginResponse, Credentials>(
  'signIn/loginUser',
  async (credentials: Credentials, thunkAPI) => {
    try {
      const response = await axios.post(apiUrl, credentials);
      showSuccessToast(response.data.message);
      return response.data;
    } catch (error: any) {
      const errorMessage = error.response?.data?.message || 'An error occurred';
      showErrorToast(errorMessage);
      return thunkAPI.rejectWithValue(errorMessage);
    }
  }
);

export const twoFactorverify = createAsyncThunk(
  'twoFactorAuth/verify',
  async ({ id, codes }: Arguments, thunkAPI) => {
    try {
      const url = `${import.meta.env.VITE_BASE_URL}/user/verify2FA/${id}`;
      const response = await axios.post(url, { code: codes });
      showSuccessToast('Vendor Logged in successfully');
      return response.data;
    } catch (error: any) {
      showErrorToast(error.response.data.error);
      return thunkAPI.rejectWithValue(
        error.response?.data || 'An error occurred'
      );
    }
  }
);

const signInSlice = createSlice({
  name: 'signIn',
  initialState,
  reducers: {
    logout(state) {
      localStorage.removeItem('token');
      return {
        ...state,
        token: null,
        user: null,
        role: null,
        message: 'Logout Successfully',
        needsVerification: false,
        needs2FA: false,
        vendor: {
          id: null,
          email: null,
        },
      };
    },
    socialLogin: (state, action) => {
      localStorage.setItem('token', action.payload);
      const decodedToken = jwtDecode<DecodedToken>(action.payload);
      userFromToken = {
        id: decodedToken.user.id,
        firstName: decodedToken.user.firstName,
        lastName: decodedToken.user.lastName,
        email: decodedToken.user.email,
        picture: decodedToken.user.picture,
        userType: decodedToken.user.userType,
      };

      state.token = action.payload;
      state.user = userFromToken;
      state.role = userFromToken.userType.name;
    },
  },
  extraReducers: (builder) => {
    builder.addCase(loginUser.pending, (state) => {
      return {
        ...state,
        loading: true,
        error: null,
        message: null,
        needsVerification: false,
        needs2FA: false,
      };
    });
    builder.addCase(
      loginUser.fulfilled,
      (state, action: PayloadAction<LoginResponse>) => {
        const newToken = action.payload.message.includes('2FA')
          ? null
          : action.payload.token;

        const isVendor = action.payload.message.includes('2FA')
          ? { id: action.payload.user.id, email: action.payload.user.email }
          : { id: null, email: null };

        localStorage.setItem('token', newToken!);

        let decodedUser = null;
        if (action.payload.token) {
          const decodedData = jwtDecode<DecodedToken>(action.payload.token);
          decodedUser = {
            id: decodedData.user.id,
            firstName: decodedData.user.firstName,
            lastName: decodedData.user.lastName,
            email: decodedData.user.email,
            picture: decodedData.user.picture,
            userType: decodedData.user.userType,
          };
        }

        return {
          ...state,
          loading: false,
          message: action.payload.message,
          token: newToken,
          user: decodedUser,
          role: action.payload.message.includes('2FA')
            ? null
            : jwtDecode<DecodedToken>(action.payload.token).user.userType.name,
          needsVerification:
            action.payload.message.includes('verify your email'),
          needs2FA: action.payload.message.includes('2FA'),
          vendor: isVendor,
        };
      }
    );
    builder.addCase(loginUser.rejected, (state, action: PayloadAction<any>) => {
      return {
        ...state,
        loading: false,
        error: action.payload.message,
        message: null,
        needsVerification: action.payload.message.includes('verify your email'),
      };
    });
    // 2FA reducers
    builder.addCase(twoFactorverify.pending, (state) => {
      return {
        ...state,
        loading: true,
        error: null,
        message: null,
      };
    });
    builder.addCase(twoFactorverify.fulfilled, (state, action) => {
      const newToken = action.payload.token;
      localStorage.setItem('token', newToken!);
      const decodedData = jwtDecode<DecodedToken>(action.payload.token);
      const decodedUser = {
        id: decodedData.user.id,
        firstName: decodedData.user.firstName,
        lastName: decodedData.user.lastName,
        email: decodedData.user.email,
        picture: decodedData.user.picture,
        userType: decodedData.user.userType,
      };
      return {
        ...state,
        loading: false,
        token: newToken,
        message: 'Vendor Logged in successfully',
        error: null,
        user: decodedUser,
      };
    });
    builder.addCase(
      twoFactorverify.rejected,
      (state, action: PayloadAction<any>) => {
        return {
          ...state,
          loading: false,
          error: action.payload.error,
          message: null,
        };
      }
    );
  },
});

export const { logout, socialLogin } = signInSlice.actions;

export default signInSlice.reducer;
