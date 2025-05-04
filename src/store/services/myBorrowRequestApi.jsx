import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';

export const myBorrowRequestApi = createApi({
  reducerPath: 'myBorrowRequestApi',
  baseQuery: fetchBaseQuery({
    baseUrl: 'http://localhost:5159/api',
    prepareHeaders: (headers) => {
      const token = localStorage.getItem('auth_token');
      if (token) headers.set('Authorization', `Bearer ${token}`);
      return headers;
    },
  }),
  tagTypes: ['MyBorrowRequest'],
  endpoints: (builder) => ({
    addBorrowRequest: builder.mutation({
      query: (bookIds) => ({
        url: '/my-borrow-requests',
        method: 'POST',
        body: { bookIds },
      }),
      invalidatesTags: ['MyBorrowRequest'],
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