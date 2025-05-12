// In your counterSlice.ts or a similar file
import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import axios, { AxiosError } from 'axios';
import { Product } from '@/types/Product';
import User from '@/types/User';
import { RootState } from '../../app/store';
import { showErrorToast, showSuccessToast } from '@/utils/ToastConfig';

interface Payload {
  message: string;
  data: Product[];
}

interface IProduct extends Product {
  similarProducts: Product[];
  totalQtySold: number;
}

interface SearchParams {
  keyword?: string;
  category?: number[];
  rating?: number[];
  page?: number;
  sort?: string;
  minPrice?: number;
  maxPrice?: number;
}

export const fetchProducts = createAsyncThunk(
  'products/fetchProducts',
  async () => {
    const response = await axios.get<Payload>(
      `${import.meta.env.VITE_BASE_URL}/product`
    );
    console.log('API Response:', response.data.data);
    return response.data.data;
  }
);

export const fetchRecommendedProducts = createAsyncThunk<Product[]>(
  'products/fetchRecommendedProducts',
  async (_, thunkAPI) => {
    try {
      const response = await axios.get(
        `${import.meta.env.VITE_BASE_URL}/product/recommended`
      );
      return response.data.data;
    } catch (err) {
      return thunkAPI.rejectWithValue('An error occured');
    }
  }
);

export const fetchProductDetails = createAsyncThunk<IProduct, number>(
  'products/fetchProductDetails',
  async (id, thunkAPI) => {
    try {
      const response = await axios.get(
        `${import.meta.env.VITE_BASE_URL}/buyer/get_product/${id}`
      );

      return response.data.product;
    } catch (err) {
      return thunkAPI.rejectWithValue('An error occured');
    }
  }
);

export const searchProducts = createAsyncThunk<
  { data: Product[]; total: number },
  SearchParams
>(
  'products/searchProducts',
  async (
    { keyword, category, rating, page, sort, minPrice, maxPrice },
    thunkAPI
  ) => {
    try {
      const response = await axios.get(
        `${import.meta.env.VITE_BASE_URL}/search`,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`,
          },
          params: {
            keyword,
            category,
            rating,
            page,
            sort,
            minPrice,
            maxPrice,
          },
        }
      );

      return response.data;
    } catch (err) {
      return thunkAPI.rejectWithValue('An error occured');
    }
  }
);

export const fetchWishlistProducts = createAsyncThunk<Product[], string | null>(
  'products/fetchWishlistProducts',
  async (token, thunkAPI) => {
    try {
      const response = await axios.get(
        `${import.meta.env.VITE_BASE_URL}/buyer/getOneWishlist`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      return response.data.data.product;
    } catch (err) {
      const error = err as AxiosError;
      if (error.response) {
        return thunkAPI.rejectWithValue(
          (error.response.data as { message: string }).message
        );
      }
      return thunkAPI.rejectWithValue('An error occured');
    }
  }
);

export const addToWishlist = createAsyncThunk<
  Product[],
  { id: number; token: string | null }
>('products/addToWishlist', async ({ id, token }, thunkAPI) => {
  try {
    const response = await axios.post(
      `${import.meta.env.VITE_BASE_URL}/buyer/addItemToWishlist`,
      { productId: id },
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

    return response.data.data.product;
  } catch (err) {
    const error = err as AxiosError;
    if (error.response) {
      return thunkAPI.rejectWithValue(
        (error.response.data as { message: string }).message
      );
    }
    return thunkAPI.rejectWithValue('An error occured');
  }
});

export const removeFromWishlist = createAsyncThunk<
  Product[],
  { id: number; token: string | null }
>('products/removeFromWishlist', async ({ id, token }, thunkAPI) => {
  try {
    const response = await axios.delete(
      `${import.meta.env.VITE_BASE_URL}/buyer/removeToWishlist`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
        data: {
          productId: id,
        },
      }
    );

    return response.data.data.product;
  } catch (err) {
    const error = err as AxiosError;
    if (error.response) {
      return thunkAPI.rejectWithValue(
        (error.response.data as { message: string }).message
      );
    }
    return thunkAPI.rejectWithValue('An error occured');
  }
});

export const submitReview = createAsyncThunk<
  { message: string; review: any },
  { content: string; rating: number; productId: number; token: string | null }
>(
  'products/submitReview',
  async ({ content, rating, productId, token }, thunkAPI) => {
    try {
      const response = await axios.post(
        `${import.meta.env.VITE_BASE_URL}/review`,
        { content, rating, productId },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      return response.data;
    } catch (err) {
      const error = err as AxiosError;
      if (error.response) {
        return thunkAPI.rejectWithValue(
          (error.response.data as { message: string }).message
        );
      }
      return thunkAPI.rejectWithValue(
        'An error occurred while submitting review'
      );
    }
  }
);

interface ProductsState {
  isLoading: boolean;
  products: Product[];
  allProducts: Product[];
  recommendedProducts: Product[];
  total: number;
  wishlistProducts: Product[];
  wishlistLoading: boolean;
  productDetailsLoading: boolean;
  productDetails: IProduct | null;
}

const initialState: ProductsState = {
  isLoading: false,
  products: [
    {
      id: 1,
      name: 'Product name',
      shortDesc:
        'Ullamco tempor duis mollit ullamco incididunt culpa elit commodo.',
      salesPrice: 230,
      regularPrice: 280,
      averageRating: 4.7,
      image: 'path_to_image',
      gallery: ['path_to_image', 'path_to_image'],
      category: {
        id: 1,
        name: 'Category name',
        description: 'Category description',
      },
      longDesc: 'Long description',
      quantity: 10,
      tags: ['tag1', 'tag2'],
      type: 'Simple',
      isAvailable: true,
      isFeatured: true,
      reviews: [],
      vendor: {
        id: 1,
        firstName: 'Vendor',
        lastName: 'Name',
        email: 'example@gmail.com',
      } as User,
    },
  ],
  allProducts: [],
  recommendedProducts: [],
  wishlistProducts: [],
  wishlistLoading: false,
  productDetails: null,
  productDetailsLoading: false,
  total: 0,
};

const productsSlice = createSlice({
  name: 'products',
  initialState,
  reducers: {
    setLoading: (state, action: PayloadAction<boolean>) => {
      return {
        ...state,
        isLoading: action.payload,
      };
    },
    search(state, action: PayloadAction<string>) {
      const searchQuery = action.payload.trim().toLowerCase();
      return {
        ...state,
        products: state.allProducts.filter(
          (product) =>
            product.name.toLowerCase().includes(searchQuery) ||
            product.shortDesc.toLowerCase().includes(searchQuery) ||
            product.longDesc.toLowerCase().includes(searchQuery) ||
            product.category.name.toLowerCase().includes(searchQuery) ||
            product.tags.some((tag) => tag.toLowerCase().includes(searchQuery))
        ),
      };
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchProducts.pending, (state) => {
        return {
          ...state,
          isLoading: true,
        };
      })
      .addCase(fetchProducts.fulfilled, (state, action) => {
        return {
          ...state,
          isLoading: false,
          products: action.payload,
          allProducts: action.payload,
        };
      })
      .addCase(fetchProducts.rejected, (state) => {
        return {
          ...state,
          isLoading: false,
        };
      })
      .addCase(searchProducts.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(searchProducts.fulfilled, (state, action) => {
        state.isLoading = false;
        state.allProducts = action.payload.data;
        state.total = action.payload.total;
      })
      .addCase(searchProducts.rejected, (state, action) => {
        state.isLoading = false;
        showErrorToast(action.payload as string);
      })
      .addCase(fetchRecommendedProducts.fulfilled, (state, action) => {
        state.recommendedProducts = action.payload;
      })
      .addCase(fetchRecommendedProducts.rejected, (_, action) => {
        showErrorToast(action.payload as string);
      })
      .addCase(fetchWishlistProducts.pending, (state) => {
        state.wishlistLoading = true;
      })
      .addCase(fetchWishlistProducts.fulfilled, (state, action) => {
        state.wishlistLoading = false;
        state.wishlistProducts = action.payload;
      })
      .addCase(fetchWishlistProducts.rejected, (state) => {
        state.wishlistLoading = false;
      })
      .addCase(addToWishlist.pending, (state) => {
        state.wishlistLoading = true;
      })
      .addCase(addToWishlist.fulfilled, (state, action) => {
        state.wishlistLoading = false;
        showSuccessToast('Product succesfully added to wishlist');
        state.wishlistProducts = action.payload;
      })
      .addCase(addToWishlist.rejected, (state, action) => {
        state.wishlistLoading = false;
        showErrorToast(action.payload as string);
      })
      .addCase(removeFromWishlist.fulfilled, (state, action) => {
        showSuccessToast('Product successfully removed from wishlist');
        state.wishlistProducts = action.payload;
      })
      .addCase(removeFromWishlist.rejected, (_, action) => {
        showErrorToast(action.payload as string);
      })
      .addCase(fetchProductDetails.pending, (state) => {
        state.productDetailsLoading = true;
      })
      .addCase(fetchProductDetails.fulfilled, (state, action) => {
        state.productDetailsLoading = false;
        state.productDetails = action.payload;
      })
      .addCase(fetchProductDetails.rejected, (state, action) => {
        state.productDetailsLoading = false;
        showErrorToast(action.payload as string);
      })
      .addCase(submitReview.pending, (state) => {
        state.productDetailsLoading = true;
      })
      .addCase(submitReview.fulfilled, (state, action) => {
        state.productDetailsLoading = false;
        if (state.productDetails) {
          state.productDetails.reviews = [
            ...state.productDetails.reviews,
            action.payload.review,
          ];
          // Update average rating
          const totalRating = state.productDetails.reviews.reduce(
            (sum, review) => sum + review.rating,
            0
          );
          state.productDetails.averageRating = Number(
            (totalRating / state.productDetails.reviews.length).toPrecision(2)
          );
        }
      })
      .addCase(submitReview.rejected, (state) => {
        state.productDetailsLoading = false;
      });
  },
});

export const { setLoading, search } = productsSlice.actions;

export const selectProducts = (state: RootState) => state.products.products;
export default productsSlice.reducer;
