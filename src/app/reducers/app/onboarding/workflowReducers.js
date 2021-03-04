import {toast} from 'react-toastify'

const getWorkflowsSuccess = (state) => {
  state.isLoading = false;
  state.isError = null;
};
const getWorkflowsRequest = (state, {payload}) => {
  state.isLoading = true;
  state.isError = null;
};
const getWorkflowsError = (state , {payload}) => {
  state.isLoading = false;
  state.isError = payload;
};

const createWorkflowSuccess = (state) => {
  state.isLoading = false;
  state.isError = null;
  toast.success("Created")
};
const createWorkflowRequest = (state, {payload}) => {
  state.isLoading = true;
  state.isError = null;
};
const createWorkflowError = (state , {payload}) => {
  state.isLoading = false;
  state.isError = payload;
};

const updateWorkflowSuccess = (state) => {
  state.isLoading = false;
  state.isError = null;
  toast.success("Saved")
};
const updateWorkflowRequest = (state, {payload}) => {
  state.isLoading = true;
  state.isError = null;
};
const updateWorkflowError = (state , {payload}) => {
  state.isLoading = false;
  state.isError = payload;
};

const deleteWorkflowSuccess = (state) => {
  state.isLoading = false;
  state.isError = null;
};
const deleteWorkflowRequest = (state, {payload}) => {
  state.isLoading = true;
  state.isError = null;
};
const deleteWorkflowError = (state , {payload}) => {
  state.isLoading = false;
  state.isError = payload;
};

export default {
  getWorkflowsSuccess,
  getWorkflowsRequest,
  getWorkflowsError,
  createWorkflowSuccess,
  createWorkflowRequest,
  createWorkflowError,
  updateWorkflowSuccess,
  updateWorkflowRequest,
  updateWorkflowError,
  deleteWorkflowSuccess,
  deleteWorkflowRequest,
  deleteWorkflowError,
  };
