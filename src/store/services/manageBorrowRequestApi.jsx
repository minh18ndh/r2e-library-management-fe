import { createApi } from '@reduxjs/toolkit/query/react';
import baseQueryWithRefresh from '../baseQueryWithRefresh';

export const manageBorrowRequestApi = createApi({
  reducerPath: 'manageBorrowRequestApi',
  baseQuery: baseQueryWithRefresh,
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
      invalidatesTags: ['Book', 'BorrowRequest'],
    }),
  }),
});

export const {
  useGetAllBorrowRequestsQuery,
  useUpdateRequestStatusMutation,
} = manageBorrowRequestApi;