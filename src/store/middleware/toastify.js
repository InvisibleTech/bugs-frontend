const toastify = (state) => (next) => (action) => {
  if (action.type !== 'error') {
    return next(action);
  } else {
    console.log(`Toastify: ${action.payload.message}`);
  }
};

export default toastify;
