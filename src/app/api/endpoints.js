export const API_AUTH = {
  login: "/api/v1/auth/login",
  register: "/api/v1/auth/register",
  refreshToken: "/api/v1/auth/refresh-token",
  changePassword: "/api/v1/auth/change-password",
};

export const API = {
  product: "/api/v1/product",
  order: "/api/v1/order",
  address: "/api/v1/address",
  user: "/api/v1/user",
};

export const GHN_API = {
  province: "https://online-gateway.ghn.vn/shiip/public-api/master-data/province",
  district: "https://online-gateway.ghn.vn/shiip/public-api/master-data/district",
  ward: "https://online-gateway.ghn.vn/shiip/public-api/master-data/ward",
  service: "https://online-gateway.ghn.vn/shiip/public-api/v2/shipping-order/available-services",
  fee: "https://online-gateway.ghn.vn/shiip/public-api/v2/shipping-order/fee"
}