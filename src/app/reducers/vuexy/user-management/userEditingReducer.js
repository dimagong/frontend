export const userEditingReducer = (state = {}, action) => {
  switch (action.type) {
    case "SET_EDIT_USER": {
      return { ...state, ...action.payload };
    }
    default: {
      return state;
    }
  }
};
