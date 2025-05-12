import { createSlice, PayloadAction, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';
import { showSuccessToast, showErrorToast } from '@/utils/ToastConfig';

interface ProductState {
  name: string;
  image: string | null;
  gallery: string[];
  shortDesc: string;
  longDesc: string;
  quantity: number;
  regularPrice: number;
  salesPrice: number;
  tags: string[];
  type: string;
  isAvailable: boolean;
  loading: boolean;
  error: string | null;
}

const initialState: ProductState = {
  name: '',
  image: null,
  gallery: [],
  shortDesc: '',
  longDesc: '',
  quantity: 0,
  regularPrice: 0,
  salesPrice: 0,
  tags: [],
  type: '',
  isAvailable: true,
  loading: false,
  error: null,
};

const apiUrl = `${import.meta.env.VITE_BASE_URL}/product`;

export const createProduct = createAsyncThunk(
  'product/createProduct',
  async (
    productData: Omit<ProductState, 'loading' | 'error'>,
    { rejectWithValue }
  ) => {
    const token = localStorage.getItem('token');
    if (!token) {
      return rejectWithValue('No token found');
    }

    try {
      const response = await axios.post(apiUrl, productData, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      return response.data;
    } catch (error: any) {
      return rejectWithValue(
        error.response?.data?.message || 'Failed to create product'
      );
    }
  }
);

const addProductSlice = createSlice({
  name: 'product',
  initialState,
  reducers: {
    setName: (state, action: PayloadAction<string>) => {
      state.name = action.payload;
    },
    setImage: (state, action: PayloadAction<string | null>) => {
      state.image = action.payload;
    },
    setGallery: (state, action: PayloadAction<string[]>) => {
      state.gallery = action.payload;
    },
    setShortDesc: (state, action: PayloadAction<string>) => {
      state.shortDesc = action.payload;
    },
    setLongDesc: (state, action: PayloadAction<string>) => {
      state.longDesc = action.payload;
    },

    setQuantity: (state, action: PayloadAction<number>) => {
      state.quantity = action.payload;
    },
    setRegularPrice: (state, action: PayloadAction<number>) => {
      state.regularPrice = action.payload;
    },
    setSalesPrice: (state, action: PayloadAction<number>) => {
      state.salesPrice = action.payload;
    },
    setTags: (state, action: PayloadAction<string[]>) => {
      state.tags = action.payload;
    },
    setType: (state, action: PayloadAction<string>) => {
      state.type = action.payload;
    },
    setAvailability: (state, action: PayloadAction<boolean>) => {
      state.isAvailable = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(createProduct.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(createProduct.fulfilled, (state) => {
        state.loading = false;
        showSuccessToast('Product created successfully');
      })
      .addCase(createProduct.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
        showErrorToast(state.error);
      });
  },
});

export const {
  setName,
  setImage,
  setGallery,
  setShortDesc,
  setLongDesc,
  setQuantity,
  setRegularPrice,
  setSalesPrice,
  setTags,
  setType,
  setAvailability,
} = addProductSlice.actions;

export default addProductSlice.reducer;
