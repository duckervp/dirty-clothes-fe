import { createSlice } from "@reduxjs/toolkit";

const authSlice = createSlice({
  name: 'auth',
  initialState: {
    user: null,
    accessToken: null,
    refreshToken: null,
    role: null
  },
  reducers: {
    setCredentials: (state, action) => {
      const { accessToken, refreshToken } = action.payload;
      if (accessToken) {
        state.accessToken = accessToken;
      }
      
      if (refreshToken) {
        state.refreshToken = refreshToken;
      }
    },
    setUser: (state, action) => {
      const user = action.payload;
      state.user = user;
    },
    logout: (state, action) => {
      state.user = null;
      state.accessToken = null;
      state.refreshToken = null;
    }
  },
});

export const { setCredentials, setUser, logout } = authSlice.actions;

export default authSlice.reducer;

export const selectCurrentUser = (state) => state.auth.user;

export const selectCurrentUserRole = (state) => state.auth.user?.role;

export const selectCurrentAccessToken = (state) => state.auth.accessToken;

export const selectCurrentRefreshToken = (state) => state.auth.refreshToken;
