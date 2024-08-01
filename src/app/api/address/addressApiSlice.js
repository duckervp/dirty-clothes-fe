import { API } from '../endpoints';
import { apiSlice } from '../apiSlice';

export const authApiSlice = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    createAddress: builder.mutation({
      query: (payload) => ({
        url: `${API.address}`,
        method: 'POST',
        body: { ...payload },
      }),
    }),
    getAllAddresses: builder.query({
      query: (params) => ({
        url: API.address,
        method: 'GET',
        params,
      }),
    }),
    getAddressDetail: builder.query({
      query: (id) => ({
        url: `${API.address}/${id}`,
        method: 'GET',
      }),
    }),
  }),
});

export const { useGetAllAddressesQuery, useGetAddressDetailQuery, useCreateAddressMutation } = authApiSlice;
