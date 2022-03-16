import { normalizeHierarchy } from "api/masterSchema/normalizers";

const resourceManagerReducer = {
  getResourceManagerHierarchySuccess: (state, { payload }) => {
    state.resourceManager.hierarchy = payload ? normalizeHierarchy(payload) : null;

    state.isLoading = false;
    state.error = null;
  },

  createResourceManagerFieldSuccess: (state, { payload }) => {
    // TODO handle response, currently hierarchy re-fetched after each update

    state.isLoading = false;
    state.error = null;
  },

  createResourceManagerGroupSuccess: (state, { payload }) => {
    // TODO handle response, currently hierarchy re-fetched after each update

    state.isLoading = false;
    state.error = null;
  },

  getResourcePreviousVersionsSuccess: (state, { payload }) => {
    state.resourceManager.connectionsAndVersions = payload;

    state.isLoading = false;
    state.error = null;
  },

  uploadResourceSuccess: (state, { payload }) => {

    state.isLoading = false;
    state.error = null;
  },

  removeResourceTemplateSuccess: (state) => {

  },

  setSelectedResourceManager: (state, { payload }) => {
    state.resourceManager.selectedResourceManager = payload;
  },
};

export default resourceManagerReducer;
