export const LOGO_NAME = "Việt Phục";

export const BASE_URL = import.meta.env.VITE_BASE_URL;

export const EMAIL_REGEX = "^[a-zA-Z0-9+_.\\-]+@[a-zA-Z0-9-]+\\.[a-zA-Z]+$";

export const PAGE_SIZE = 10;

export const Role = {
  ADMIN: "ADMIN",
  USER: "USER",
}

export const GHN = {
  shopId: import.meta.env.VITE_GHN_SHOP_ID,
  token: import.meta.env.VITE_GHN_TOKEN,
  serviceId: parseInt(import.meta.env.VITE_GHN_SERVICE_ID, 10)
}

