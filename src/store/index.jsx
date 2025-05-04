import { configureStore } from '@reduxjs/toolkit';
import { setupListeners } from '@reduxjs/toolkit/query';
import { authApi } from './services/authApi';
import { bookApi } from './services/bookApi';
import { categoryApi } from './services/categoryApi';
import { myBorrowRequestApi } from './services/myBorrowRequestApi';
import { manageBorrowRequestApi } from './services/manageBorrowRequestApi';

export const store = configureStore({
  reducer: {
    [authApi.reducerPath]: authApi.reducer,
    [bookApi.reducerPath]: bookApi.reducer,
    [categoryApi.reducerPath]: categoryApi.reducer,
    [myBorrowRequestApi.reducerPath]: myBorrowRequestApi.reducer,
    [manageBorrowRequestApi.reducerPath]: manageBorrowRequestApi.reducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(
      authApi.middleware,
      bookApi.middleware,
      categoryApi.middleware,
      myBorrowRequestApi.middleware,
      manageBorrowRequestApi.middleware
    ),
});

setupListeners(store.dispatch);

export default store;