import { createApi } from '@reduxjs/toolkit/query/react';
import baseQueryWithRefresh from '../baseQueryWithRefresh';

export const bookApi = createApi({
  reducerPath: 'bookApi',
  baseQuery: baseQueryWithRefresh,
  tagTypes: ['Book'],
  endpoints: (builder) => ({
    getBooks: builder.query({
      query: ({ search = '', sort = '', categoryId = null } = {}) => ({
        url: '/books',
        params: {
          ...(search && { search }),
          ...(sort && { sort }),
          ...(categoryId && { categoryId }),
        },
      }),
      providesTags: ['Book'],
    }),

    addBook: builder.mutation({
      query: (book) => ({
        url: '/books',
        method: 'POST',
        body: book,
      }),
      invalidatesTags: ['Book'],
    }),

    updateBook: builder.mutation({
      query: ({ id, ...rest }) => ({
        url: `/books/${id}`,
        method: 'PUT',
        body: rest,
      }),
      invalidatesTags: ['Book'],
    }),

    deleteBook: builder.mutation({
      query: (id) => ({
        url: `/books/${id}`,
        method: 'DELETE',
      }),
      invalidatesTags: ['Book'],
    }),
  }),
});

export const {
  useGetBooksQuery,
  useAddBookMutation,
  useUpdateBookMutation,
  useDeleteBookMutation,
} = bookApi;