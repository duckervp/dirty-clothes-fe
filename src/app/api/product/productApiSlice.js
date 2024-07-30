import { API } from "../endpoints";
import { apiSlice, noAuthApiSlice } from "../apiSlice";

export const noTokenApiSlice = noAuthApiSlice.injectEndpoints({
  endpoints: (builder) => ({
    getAllProducts: builder.query({
      query: (params) => ({
        url: API.product,
        method: "GET",
        params
      }),
    }),
    getProductDetail: builder.query({
      query: (slug) => ({
        url: `${API.product}/${slug}/detail`,
        method: "GET"
      }),
    }),
  }),
});

export const authApiSlice = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    updatePassword: builder.mutation({
      query: (payload) => ({
        url: `/users/auth/change-password`,
        method: "PATCH",
        body: {...payload}
      }),
    }),
  }),
});

export const { 
  useGetAllProductsQuery, 
  useGetProductDetailQuery
} = noTokenApiSlice;

export const { 
  useUpdatePasswordMutation,
} = authApiSlice;

