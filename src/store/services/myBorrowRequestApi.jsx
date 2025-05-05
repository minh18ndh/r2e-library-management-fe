import { createApi } from '@reduxjs/toolkit/query/react';
import baseQueryWithRefresh from '../baseQueryWithRefresh';

export const myBorrowRequestApi = createApi({
  reducerPath: 'myBorrowRequestApi',
  baseQuery: baseQueryWithRefresh,
  tagTypes: ['MyBorrowRequest'],
  endpoints: (builder) => ({
    addBorrowRequest: builder.mutation({
      query: (bookIds) => ({
        url: '/my-borrow-requests',
        method: 'POST',
        body: { bookIds },
      }),
      invalidatesTags: ['MyBorrowRequest', 'Book'],
    }),

    getMyBorrowRequests: builder.query({
      query: () => '/my-borrow-requests',
      providesTags: ['MyBorrowRequest'],
    }),
  }),
});

export const {
  useAddBorrowRequestMutation,
  useGetMyBorrowRequestsQuery,
} = myBorrowRequestApi;