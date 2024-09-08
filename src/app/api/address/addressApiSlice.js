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
      invalidatesTags: ['Address'],
    }),
    getAllAddresses: builder.query({
      query: (params) => ({
        url: API.address,
        method: 'GET',
        params,
      }),
      providesTags: ['Address'],
    }),
    getAddressDetail: builder.query({
      query: (id) => ({
        url: `${API.address}/${id}`,
        method: 'GET',
      }),
    }),
    deleteAddress: builder.mutation({
      query: (id) => ({
        url: `${API.address}/${id}`,
        method: 'DELETE',
      }),
      invalidatesTags: ['Address'],
    }),
    updateAddress: builder.mutation({
      query: ({ id, payload }) => ({
        url: `${API.address}/${id}`,
        method: "PATCH",
        body: { ...payload },
      }),
      invalidatesTags: ['Address'],
    }),
  }),
});

export const {
  useGetAllAddressesQuery,
  useGetAddressDetailQuery,
  useCreateAddressMutation,
  useDeleteAddressMutation,
  useUpdateAddressMutation,
} = authApiSlice;
