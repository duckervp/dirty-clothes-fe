import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';

import { showErrorMessage } from 'src/utils/notify';

import { API_AUTH } from './endpoints';
import { BASE_URL } from '../../config';
import { logout, setCredentials } from './auth/authSlice';

const baseQuery = fetchBaseQuery({
  baseUrl: BASE_URL,
  prepareHeaders: (headers, { getState }) => {
    headers.set('ngrok-skip-browser-warning', true);
    const { accessToken } = getState().auth;
    if (accessToken) {
      headers.set('Authorization', `Bearer ${accessToken}`);
    }
    return headers;
  },
});

const baseQueryWithNoAuth = fetchBaseQuery({
  baseUrl: BASE_URL,
  prepareHeaders: (headers) => {
    headers.set('ngrok-skip-browser-warning', true);
    return headers;
  },
});

const baseQueryWithReauth = async (args, api, extraOptions) => {
  let result = await baseQuery(args, api, extraOptions);

  const state = api.getState();

  if (result.error?.status === 401) {
    const refreshResult = await baseQueryWithNoAuth(
      {
        url: API_AUTH.refreshToken,
        method: 'POST',
        body: {
          refreshToken: state.auth.refreshToken,
        },
      },
      api,
      extraOptions
    );

    if (!refreshResult.error) {
      const { accessToken, refreshToken } = refreshResult.data.data;
      if (accessToken) {
        api.dispatch(setCredentials({ accessToken, refreshToken }));
        result = await baseQuery(args, api, extraOptions);
      } else {
        api.dispatch(logout());
      }
    } else {
      showErrorMessage(refreshResult.error);
      api.dispatch(logout());
    }
  }

  return result;
};

const tags = ['User', 'Product', 'Category', 'Color', 'Order', 'OrderDetail', 'Address'];

export const apiSlice = createApi({
  reducerPath: 'api',
  baseQuery: baseQueryWithReauth,
  refetchOnMountOrArgChange: true,
  tagTypes: tags,
  endpoints: (builder) => ({}),
});

export const noAuthApiSlice = createApi({
  reducerPath: 'noAuthApi',
  baseQuery: baseQueryWithNoAuth,
  refetchOnMountOrArgChange: true,
  tagTypes: tags,
  endpoints: (builder) => ({}),
});
