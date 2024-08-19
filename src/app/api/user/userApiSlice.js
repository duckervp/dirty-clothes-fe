import { API } from '../endpoints';
import { apiSlice } from '../apiSlice';

export const authApiSlice = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    changeName: builder.mutation({
      query: (payload) => ({
        url: `${API.user}/update-name`,
        method: 'PATCH',
        body: { ...payload },
      }),
    }),
    updateAvatar: builder.mutation({
      query: (payload) => ({
        url: `${API.user}/update-avatar`,
        method: 'PATCH',
        body: { ...payload },
      }),
    }),

    getAllUsers: builder.query({
      query: (params) => ({
        url: API.user,
        method: "GET",
        params
      }),
    }),
    getUserDetail: builder.query({
      query: (id) => ({
        url: `${API.user}/${id}`,
        method: "GET"
      }),
    }),
  }),
});

export const { useChangeNameMutation, useUpdateAvatarMutation, useGetAllUsersQuery, useGetUserDetailQuery } = authApiSlice;
