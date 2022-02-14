import axios from 'axios';
import * as actions from '../api';

const api =
  ({ dispatch }) =>
  (next) =>
  async (action) => {
    if (action.type !== actions.apiCallBegan.type) return next(action);

    const { url, method, data, onStart, onSuccess, onError } = action.payload;

    if (onStart) dispatch({ type: onStart });

    // To get the given action into redux tools need to
    // call next.
    next(action);

    try {
      const response = await axios.request({
        baseURL: 'http://localhost:9001/api',
        url,
        method,
        data,
      });

      // General processing for success
      dispatch(actions.apiCallSuccess(response.data));

      // Conditional processing for success
      if (onSuccess) dispatch({ type: onSuccess, payload: response.data });
    } catch (error) {
      // General middleware error action
      dispatch(actions.apiCallFailed(error.message));

      // Conditional middleware error action - like we want to do something
      // specific to the use case.
      if (onError) dispatch({ type: onError, payload: error.message });
    }
  };

export default api;
