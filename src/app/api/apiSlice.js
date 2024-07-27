import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';

import { API_AUTH } from './endpoints';
import { BASE_URL } from '../../../config';
import { logout, setCredentials } from './auth/authSlice';

const baseQuery = fetchBaseQuery({
  credentials: "include",
  baseUrl: BASE_URL,
  prepareHeaders: (headers, { getState }) => {
    headers.set("ngrok-skip-browser-warning", true);
    const { token } = getState().auth;
    if (token) {
      headers.set("Authorization", `Bearer ${token}`)
    }
    return headers;
  }
});

const baseQueryWithNoAuth = fetchBaseQuery({
  credentials: "include",
  baseUrl: BASE_URL,
  // prepareHeaders: (headers) => {
  //   headers.set("ngrok-skip-browser-warning", true);
  //   return headers;
  // }
});

const baseQueryWithReauth = async (args, api, extraOptions) => {
  let result = await baseQuery(args, api, extraOptions);

  const state = api.getState();
  console.log('Current state:', state);

  if (result?.error?.data?.code === 401) {
    const refreshResult = await baseQueryWithNoAuth(API_AUTH.refreshToken, api, extraOptions);
    const accessToken = refreshResult?.data?.access_token;
    if (accessToken) {
      api.dispatch(setCredentials({ accessToken }));
      result = await baseQuery(args, api, extraOptions);
    } else {
      api.dispatch(logout());
    }
  }

  return result;
}

export const apiSlice = createApi({
  reducerPath: "api",
  baseQuery: baseQueryWithReauth,
  refetchOnMountOrArgChange: true,
  endpoints: (builder) => ({}),
});

export const noAuthApiSlice = createApi({
  reducerPath: "noAuthApi",
  baseQuery: baseQueryWithNoAuth,
  refetchOnMountOrArgChange: true,
  endpoints: (builder) => ({}),
});