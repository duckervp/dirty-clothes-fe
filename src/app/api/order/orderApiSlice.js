import { API } from '../endpoints';
import { apiSlice, noAuthApiSlice } from '../apiSlice';

export const noTokenApiSlice = noAuthApiSlice.injectEndpoints({
  endpoints: (builder) => ({
    getAllOrders: builder.query({
      query: (params) => ({
        url: API.order,
        method: 'GET',
        params,
      }),
    }),
    getOrderDetail: builder.query({
      query: (code) => ({
        url: `${API.order}/${code}/detail`,
        method: 'GET',
      }),
    }),
    createOrder: builder.mutation({
      query: (payload) => ({
        url: `${API.order}`,
        method: 'POST',
        body: { ...payload },
      }),
    }),
  }),
});

export const authApiSlice = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    updatePassword: builder.mutation({
      query: (payload) => ({
        url: `/users/auth/change-password`,
        method: 'PATCH',
        body: { ...payload },
      }),
    }),
  }),
});

export const { useGetAllOrdersQuery, useGetOrderDetailQuery, useCreateOrderMutation } =
  noTokenApiSlice;

export const { useUpdatePasswordMutation } = authApiSlice;
