import storage from "redux-persist/lib/storage";
import { configureStore, combineReducers } from "@reduxjs/toolkit";
import {
  FLUSH,
  PAUSE,
  PURGE,
  PERSIST,
  REGISTER,
  REHYDRATE,
  persistStore,
  persistReducer,
} from 'redux-persist'

import authReducer from "./api/auth/authSlice";
import cartReducer from "./api/cart/cartSlice";
import { apiSlice, noAuthApiSlice } from "./api/apiSlice";

const authPersistConfig = {
  key: 'auth',
  storage,
  blacklist: ['token']
}

const cartPersistConfig = {
  key: 'cart',
  storage
}

const rootReducer = combineReducers({
  [apiSlice.reducerPath]: apiSlice.reducer,
  [noAuthApiSlice.reducerPath]: noAuthApiSlice.reducer,
  auth: persistReducer(authPersistConfig, authReducer),
  cart: persistReducer(cartPersistConfig, cartReducer),
});

export const store = configureStore({
  reducer: rootReducer,
  middleware: getDefaultMiddleware => getDefaultMiddleware(
    {
      serializableCheck: {
        ignoredActions: [FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER],
      },
    }
  )
    .concat(apiSlice.middleware)
    .concat(noAuthApiSlice.middleware),
  devTools: process.env.NODE_ENV !== 'production',
});

export const persistor = persistStore(store);