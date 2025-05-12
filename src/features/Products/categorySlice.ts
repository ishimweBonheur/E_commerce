import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import axios from 'axios';
import { Category } from '@/types/Product';
import { RootState } from '../../app/store';

interface Payload {
  message: string;
  data: Category[];
}
export const fetchCategories = createAsyncThunk(
  'categories/fetchCategories',
  async () => {
    const response = await axios.get<Payload>(
      `${import.meta.env.VITE_BASE_URL}/category`
    );
    return response.data.data;
  }
);

interface CategoryState {
  isLoading: boolean;
  focused: number;
  categories: Category[];
}

const initialState: CategoryState = {
  isLoading: false,
  focused: -1,
  categories: [
    {
      id: 1,
      name: 'Category name',
      description: 'Category description',
    },
  ],
};

const categoriesSlice = createSlice({
  name: 'categories',
  initialState,
  reducers: {
    setFocused: (state, action: PayloadAction<number>) => {
      return {
        ...state,
        focused: action.payload,
      };
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchCategories.pending, (state) => {
        return {
          ...state,
          isLoading: true,
        };
      })
      .addCase(fetchCategories.fulfilled, (state, action) => {
        return {
          ...state,
          isLoading: false,
          categories: action.payload,
        };
      })
      .addCase(fetchCategories.rejected, (state) => {
        return {
          ...state,
          isLoading: false,
        };
      });
  },
});

export const { setFocused } = categoriesSlice.actions;

export const selectCategories = (state: RootState) =>
  state.categories.categories;

export const getFocused = (state: RootState) => state.categories.focused;
export default categoriesSlice.reducer;
