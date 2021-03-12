import {toast} from 'react-toastify'

const getWorkflowsSuccess = (state) => {
  state.isLoading = false;
  state.isError = null;
};

const createWorkflowSuccess = (state) => {
  state.isLoading = false;
  state.isError = null;
  toast.success("Created")
};

const updateWorkflowSuccess = (state) => {
  state.isLoading = false;
  state.isError = null;
  toast.success("Saved")
};

const deleteWorkflowSuccess = (state) => {
  state.isLoading = false;
  state.isError = null;
};

export default {
  getWorkflowsSuccess,
  createWorkflowSuccess,
  updateWorkflowSuccess,
  deleteWorkflowSuccess,
};
