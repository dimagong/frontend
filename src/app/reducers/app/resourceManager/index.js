const resourceManagerReducer = {
  setSelectedResourceManager: (state, { payload }) => {
    state.resourceManager.selectedResourceManager = payload;
  },
};

export default resourceManagerReducer;
