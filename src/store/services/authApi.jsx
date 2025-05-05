import { createApi } from '@reduxjs/toolkit/query/react';
import baseQueryWithRefresh from '../baseQueryWithRefresh';

export const authApi = createApi({
  reducerPath: 'authApi',
  baseQuery: baseQueryWithRefresh,
  endpoints: (builder) => ({
    login: builder.mutation({
      query: (credentials) => ({
        url: '/auth/login',
        method: 'POST',
        body: credentials,
      }),
      transformResponse: (response) => {
        localStorage.setItem('auth_token', response.accessToken);
        localStorage.setItem('refresh_token', response.refreshToken);
        return response;
      },
    }),

    register: builder.mutation({
      query: (userData) => ({
        url: '/auth/register',
        method: 'POST',
        body: userData,
      }),
    }),
  }),
});

export const {
  useLoginMutation,
  useRegisterMutation,
} = authApi;