import { fetchBaseQuery } from '@reduxjs/toolkit/query';

const baseQuery = fetchBaseQuery({
  baseUrl: 'http://localhost:5159/api',
  prepareHeaders: (headers) => {
    const token = localStorage.getItem('auth_token');
    if (token) headers.set('Authorization', `Bearer ${token}`);
    return headers;
  },
});

const baseQueryWithRefresh = async (args, api, extraOptions) => {
  let result = await baseQuery(args, api, extraOptions);

  if (result.error?.status === 401) {
    const refreshToken = localStorage.getItem('refresh_token');

    // Try to refresh the token
    const refreshResult = await baseQuery(
      {
        url: '/auth/refresh-token',
        method: 'POST',
        body: { refreshToken },
      },
      api,
      extraOptions
    );

    if (refreshResult.data) {
      localStorage.setItem('auth_token', refreshResult.data.accessToken);
      localStorage.setItem('refresh_token', refreshResult.data.refreshToken);

      // Retry the original request with new access token
      result = await baseQuery(args, api, extraOptions);
    } else {
      // Refresh failed -> log out user
      localStorage.removeItem('auth_token');
      localStorage.removeItem('refresh_token');
      window.location.href = '/login';
    }
  }

  return result;
};

export default baseQueryWithRefresh;