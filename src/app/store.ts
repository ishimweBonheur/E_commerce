import { configureStore } from '@reduxjs/toolkit';
import signUpReducer from '../features/Auth/SignUpSlice';
import signInReducer from '../features/Auth/SignInSlice';
import productsReducer from '@/features/Products/ProductSlice';
import categoriesReducer from '@/features/Products/categorySlice';
import bannerReducer from '@/app/bannerAds/BannerSlice';
import availableProductsSlice from '@/features/Popular/availableProductSlice';
import bestSellingProductSlice from '@/features/Popular/bestSellingProductSlice';
import subscribeReducer from '@/app/Footer/Subscribe';
import addProductSlice from '@/features/Dashboard/addProductSlice';
import dashboardProductsSlice from '@/features/Dashboard/dashboardProductsSlice';
import allProductSlice from '@/app/Dashboard/AllProductSlices';
import {
  passwordRequestReducer,
  passwordResetReducer,
} from '@/features/Auth/password';
import buyerSlice from '@/app/Dashboard/buyerSlice';
import orderSlice from './Dashboard/orderSlice';
import cartReducer from '@/features/Cart/cartSlice';
import checkoutSlice from '@/features/Checkout/checkoutSlice';

import ordersSliceReducer from '@/features/Orders/ordersSlice';
import contactReducer from '@/features/contact/contactSlice';
import userRoleSlice from '@/features/userRole/userRoleSlice';
import couponsSliceReducer from '@/features/Coupons/CouponsFeature';

export const store = configureStore({
  reducer: {
    products: productsReducer,
    categories: categoriesReducer,
    signUp: signUpReducer,
    signIn: signInReducer,
    banners: bannerReducer,
    availableProducts: availableProductsSlice,
    bestSellingProducts: bestSellingProductSlice,
    footer: subscribeReducer,
    passwordRequest: passwordRequestReducer,
    passwordReset: passwordResetReducer,
    buyer: buyerSlice,
    order: orderSlice,
    orders: ordersSliceReducer,
    product: addProductSlice,
    DeshboardProducts: dashboardProductsSlice,
    cartItems: cartReducer,
    allProducts: allProductSlice,
    contact: contactReducer,
    checkout: checkoutSlice,
    coupons: couponsSliceReducer,
    userRoles: userRoleSlice,
  },
});

export type RootState = ReturnType<typeof store.getState>;

export type AppDispatch = typeof store.dispatch;
