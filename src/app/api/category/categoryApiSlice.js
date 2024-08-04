import { API } from "../endpoints";
import { noAuthApiSlice } from "../apiSlice";

export const noTokenApiSlice = noAuthApiSlice.injectEndpoints({
  endpoints: (builder) => ({
    getAllCategories: builder.query({
      query: (params) => ({
        url: API.category,
        method: "GET",
        params
      }),
    }),
  }),
});

export const { 
  useGetAllCategoriesQuery
} = noTokenApiSlice;

