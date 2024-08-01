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
  }),
});

export const authApiSlice = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    createOrder: builder.mutation({
      query: (payload) => ({
        url: `${API.order}`,
        method: 'POST',
        body: { ...payload },
      }),
    }),
  }),
});

export const { useGetAllOrdersQuery, useGetOrderDetailQuery } = noTokenApiSlice;

export const { useCreateOrderMutation } = authApiSlice;
