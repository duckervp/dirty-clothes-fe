import { GHN } from 'src/config';

import { GHN_API } from '../endpoints';
import { noAuthApiSlice } from '../apiSlice';

export const noTokenApiSlice = noAuthApiSlice.injectEndpoints({
  endpoints: (builder) => ({
    getProvinces: builder.query({
      query: () => ({
        url: GHN_API.province,
        method: 'GET',
        headers: {
          token: GHN.token,
        },
      }),
    }),
    getDistricts: builder.mutation({
      query: (payload) => ({
        url: GHN_API.district,
        method: 'POST',
        body: { ...payload },
        headers: {
          token: GHN.token,
        },
      }),
    }),

    getWards: builder.mutation({
      query: (payload) => ({
        url: GHN_API.ward,
        method: 'POST',
        body: { ...payload },
        headers: {
          token: GHN.token,
        },
      }),
    }),
    getFee: builder.mutation({
      query: (payload) => ({
        url: GHN_API.fee,
        method: 'POST',
        body: {
          service_id: GHN.serviceId,
          insurance_value: 500000,
          coupon: null,
          height: 10,
          length: 20,
          weight: 500,
          width: 20,
          from_district_id: 1485, // Cau Giay
          from_ward_code: '1A0608', // Yen Hoa
          ...payload,
        },
        headers: {
          token: GHN.token,
          shop_id: GHN.shopId,
        },
      }),
    }),
  }),
});

export const {
  useGetProvincesQuery,
  useGetDistrictsMutation,
  useGetWardsMutation,
  useGetFeeMutation,
} = noTokenApiSlice;
