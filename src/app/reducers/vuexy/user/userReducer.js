export const profile = (state = {}, action) => {
  switch (action.type) {
    case "SET_USER_PROFILE": {
      return { ...state, ...action.payload };
    }
    default: {
      return state;
    }
  }
};

export const list = (
  state = {
    data: [],
    nav: {
      pageSize: 10,
      currPage: 1,
      searchVal: "",
      total: 10,
    },
  },
  action
) => {
  switch (action.type) {
    case "SET_USERS_LIST": {
      return { ...state, ...action.payload };
    }
    case "UPDATE_USER_IN_LIST": {
      return {
        ...state,
        data: state.data.map((user) => {
          if (action.payload.data.id === user.id) {
            return action.payload.data;
          }
          return user;
        }),
      };
    }
    default: {
      return state;
    }
  }
};
