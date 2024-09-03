import { fViCurrency } from 'src/utils/format-number';

export const LOGO_NAME = "Cổ Trang Việt VTT";

export const LOGO_FONT = "Pacifico";

export const BASE_URL = import.meta.env.VITE_BASE_URL;

export const EMAIL_REGEX = "^[a-zA-Z0-9+_.\\-]+@[a-zA-Z0-9-]+\\.[a-zA-Z]+$";

export const PAGE_SIZE = 10;

export const Role = {
  ADMIN: "ADMIN",
  USER: "USER",
}

export const FREE_SHIPPING_MODE = true;

export const GHN = {
  shopId: import.meta.env.VITE_GHN_SHOP_ID,
  token: import.meta.env.VITE_GHN_TOKEN,
  serviceId: parseInt(import.meta.env.VITE_GHN_SERVICE_ID, 10)
}



// ----------------------------------------------------------------------

export const TARGET_OPTIONS = [
  { value: 'MEN', label: 'Men' },
  { value: 'WOMEN', label: 'Women' },
  { value: 'KIDS', label: 'Kids' },
  { value: 'UNISEX', label: 'Unisex' },
];

export const PRODUCT_STATUS_OPTIONS = [
  { value: 'NEW', label: 'New' },
  { value: 'SALE', label: 'On Sale' }
];

export const SIZE_OPTIONS = [
  { value: 'FREE_SIZE', label: 'Free Size' },
  { value: 'SIZE_XL', label: 'Size XL' },
  { value: 'SIZE_S', label: 'Size S' },
  { value: 'SIZE_XXL', label: 'Size XXL' },
  { value: 'SIZE_M', label: 'Size M' },
  { value: 'SIZE_3XL', label: 'Size 3XL' },
  { value: 'SIZE_L', label: 'Size L' },
  { value: 'SIZE_4XL', label: 'Size 4XL' },
];
export const CATEGORY_OPTIONS = ['All', 'Shose', 'Apparel', 'Accessories'];
export const RATING_OPTIONS = ['up4Star', 'up3Star', 'up2Star', 'up1Star'];
export const PRICE_OPTIONS = [
  { value: 'all', label: 'All' },
  { value: 'below-500k', label: `Below ${fViCurrency(500000)}`, priceFrom: 0, priceTo: 500000 },
  {
    value: 'between-500k-1m',
    label: `${fViCurrency(500000)} - ${fViCurrency(1000000)}`,
    priceFrom: 500000,
    priceTo: 1000000,
  },
  {
    value: 'between-1m-2m',
    label: `${fViCurrency(1000000)} - ${fViCurrency(2000000)}`,
    priceFrom: 1000000,
    priceTo: 2000000,
  },
  {
    value: 'above-2m',
    label: `Above ${fViCurrency(2000000)}`,
    priceFrom: 2000000,
  },
];
export const ORDER_STATUS = {
  ORDER: "ORDER",
  REFUSED: "REFUSED",
  ACCEPTED: "ACCEPTED",
  DELIVERY: "DELIVERY",
  DONE: "DONE",
  CANCELLED: "CANCELLED"
}
