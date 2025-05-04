import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';

export const manageBorrowRequestApi = createApi({
  reducerPath: 'manageBorrowRequestApi',
  baseQuery: fetchBaseQuery({
    baseUrl: 'http://localhost:5159/api',
    prepareHeaders: (headers) => {
      const token = localStorage.getItem('auth_token');
      if (token) headers.set('Authorization', `Bearer ${token}`);
      return headers;
    },
  }),
  tagTypes: ['BorrowRequest'],
  endpoints: (builder) => ({
    getAllBorrowRequests: builder.query({
      query: () => '/borrow-requests',
      providesTags: ['BorrowRequest'],
    }),

    updateRequestStatus: builder.mutation({
      query: ({ id, status }) => ({
        url: `/borrow-requests/${id}/status`,
        method: 'PUT',
        body: { status },
      }),
      invalidatesTags: ['BorrowRequest'],
    }),
  }),
});

export const {
  useGetAllBorrowRequestsQuery,
  useUpdateRequestStatusMutation,
} = manageBorrowRequestApi;