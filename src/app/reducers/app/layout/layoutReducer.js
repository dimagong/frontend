const layoutReducer = {
  showContextSearch: (state) => {
    state.isContextSearchVisible = true;
  },

  hideContextSearch: (state) => {
    state.isContextSearchVisible = false
  },

  setContext: (state, {payload}) => {
    state.context = payload;
  },

  setPreview: (state, {payload}) => {
    state.preview = payload;
  },

  setNotificationsAndWorkFlowsContext: (state, {payload}) => {
    state.notificationsAndWorkFlowContext = payload;
  }

};

export default layoutReducer;
