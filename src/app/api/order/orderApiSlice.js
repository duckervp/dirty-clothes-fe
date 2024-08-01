import { API } from '../endpoints';
import { apiSlice } from '../apiSlice';

export const authApiSlice = apiSlice.injectEndpoints({
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

export const { useCreateOrderMutation, useGetAllOrdersQuery, useGetOrderDetailQuery } = authApiSlice;
