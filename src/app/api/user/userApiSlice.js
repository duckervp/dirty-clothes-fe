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
  }),
});

export const { useChangeNameMutation, useUpdateAvatarMutation } = authApiSlice;