const loadingReducer = (state = {}, action) => {
  const { type } = action;
  const matches = /(.*)(Request|Success|Error)/.exec(type);

  // not a *Request / *Success /  *Error actions, so we ignore them
  if (!matches) return state;

  const [, requestName, requestState] = matches;
  return {
    ...state,
    // Store whether a request is happening at the moment or not
    // e.g. will be true when receiving GET_TODOS_REQUEST
    //      and false when receiving GET_TODOS_SUCCESS / GET_TODOS_FAILURE
    [requestName]: requestState === 'Request',
  };
};

export default loadingReducer;
