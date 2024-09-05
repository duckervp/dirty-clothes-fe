export const HOME_INDEX = '/';

export const getUrl = (path, params) => {
  const url = HOME_INDEX.concat(path);
  
  if (params && params.id) {
    return url.replace(':id', params.id);
  }
  
  return url;
};

// AUTH ROUTES
export const AUTH = {
  LOGIN: 'login',
  REGISTER: 'register',
  UNAUTHORIZED: 'unauthorized'
}

// USER SITE ROUTES
export const SHOP = 'shop';
export const SHOP_CATEGORY = ':category';
export const BEST_SELLER = 'best-seller';
export const CONTACT = 'contact';
export const CART = 'cart';
export const PRODUCT_DETAIL = ':slug';
export const ORDER = 'order';
export const PAYMENT = 'payment';
export const BUYNOW = 'payment?buyNow=true';
export const PROFILE = 'profile';
export const ADDRESS = 'address';


// ADMIN SITE ROUTES

export const ADMIN = 'admin';

export const CATEGORY_MANAGEMENT = {
  INDEX: 'admin/category-management',
  DETAILS: 'admin/category-management/category-details/:id',
  EDIT: 'admin/category-management/edit-category/:id',
  CREATE: 'admin/category-management/create-category'
}

export const COLOR_MANAGEMENT = {
  INDEX: 'admin/color-management',
  DETAILS: 'admin/color-management/color-details/:id',
  EDIT: 'admin/color-management/edit-color/:id',
  CREATE: 'admin/color-management/create-color'
}

export const USER_MANAGEMENT = {
  INDEX: 'admin/user-management',
  DETAILS: 'admin/user-management/user-details/:id',
  EDIT: 'admin/user-management/edit-user/:id',
  CREATE: 'admin/user-management/create-user'
}

export const PRODUCT_MANAGEMENT = {
  INDEX: 'admin/product-management',
  DETAILS: 'admin/product-management/product-details/:id',
  EDIT: 'admin/product-management/edit-product/:id',
  CREATE: 'admin/product-management/create-product'
}

export const ORDER_MANAGEMENT = {
  INDEX: 'admin/order-management',
  DETAILS: 'admin/order-management/order-details/:id',
  EDIT: 'admin/order-management/edit-order/:id',
  CREATE: 'admin/order-management/create-order'
}