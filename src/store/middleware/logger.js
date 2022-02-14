// A curried version of (store, next, action) => {}
// to parameterize the middleware
// (config) => (store) => (next) => (action) => { }
// then when we configure it:
// return configureStore({ reducer, middleware: [logger({dest: "console"})] });
const logger = (store) => (next) => (action) => {
  console.log('action', action);

  return next(action);
};

export default logger;
