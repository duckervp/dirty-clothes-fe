import { API } from "../endpoints";
import { noAuthApiSlice } from "../apiSlice";

export const noTokenApiSlice = noAuthApiSlice.injectEndpoints({
  endpoints: (builder) => ({
    getAllColors: builder.query({
      query: (params) => ({
        url: API.color,
        method: "GET",
        params
      }),
    }),
  }),
});

export const { 
  useGetAllColorsQuery
} = noTokenApiSlice;

