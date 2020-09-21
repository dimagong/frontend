const getWorkflowsSuccess = (state) => ({
    ...state,
    isLoading: false,
    isError: null,
  });
  
  const getWorkflowsRequest = (state, {payload}) => ({
    ...state,
    isLoading: true,
    isError: null,
  });
  const getWorkflowsError = (state , {payload}) => ({
    ...state,
    isLoading: false,
    isError: payload,
  });

  const createWorkflowSuccess = (state) => ({
    ...state,
    isLoading: false,
    isError: null,
  });
  
  const createWorkflowRequest = (state, {payload}) => ({
    ...state,
    isLoading: true,
    isError: null,
  });
  const createWorkflowError = (state , {payload}) => ({
    ...state,
    isLoading: false,
    isError: payload,
  });

  const updateWorkflowSuccess = (state) => ({
    ...state,
    isLoading: false,
    isError: null,
  });
  
  const updateWorkflowRequest = (state, {payload}) => ({
    ...state,
    isLoading: true,
    isError: null,
  });
  const updateWorkflowError = (state , {payload}) => ({
    ...state,
    isLoading: false,
    isError: payload,
  });

  const deleteWorkflowSuccess = (state) => ({
    ...state,
    isLoading: false,
    isError: null,
  });
  
  const deleteWorkflowRequest = (state, {payload}) => ({
    ...state,
    isLoading: true,
    isError: null,
  });
  const deleteWorkflowError = (state , {payload}) => ({
    ...state,
    isLoading: false,
    isError: payload,
  });


  
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