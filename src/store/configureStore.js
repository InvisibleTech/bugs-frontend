import { configureStore } from '@reduxjs/toolkit';
import api from './middleware/api';
import toastify from './middleware/toastify';
import reducer from './reducer';

export default function nazre() {
  // NOTE: if not using react toolkit then
  // createStore(reducer, applyMiddleware(logger))
  //
  // middleware is performed in order left -> right
  //
  // NOTE: redux toolkit by default has thunk (not func)
  // to do the double dispatch magic. However, by setting
  // middleware here we will overwrite that - so we need
  // getDefaultMiddleware
  return configureStore({
    reducer,
    middleware: (getDefaultMiddleware) => getDefaultMiddleware().concat([toastify, api]),
  });
}
