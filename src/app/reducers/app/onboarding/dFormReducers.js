const getdFormsSuccess = (state) => ({
    ...state,
    isLoading: false,
    isError: null,
  });
  
  const getdFormsRequest = (state, {payload}) => ({
    ...state,
    isLoading: true,
    isError: null,
  });
  const getdFormsError = (state , {payload}) => ({
    ...state,
    isLoading: false,
    isError: payload,
  });

  const createdFormSuccess = (state) => ({
    ...state,
    isLoading: false,
    isError: null,
  });
  
  const createdFormRequest = (state, {payload}) => ({
    ...state,
    isLoading: true,
    isError: null,
  });
  const createdFormError = (state , {payload}) => ({
    ...state,
    isLoading: false,
    isError: payload,
  });

  const updatedFormSuccess = (state) => ({
    ...state,
    isLoading: false,
    isError: null,
  });
  
  const updatedFormRequest = (state, {payload}) => ({
    ...state,
    isLoading: true,
    isError: null,
  });
  const updatedFormError = (state , {payload}) => ({
    ...state,
    isLoading: false,
    isError: payload,
  });

  const deletedFormSuccess = (state) => ({
    ...state,
    isLoading: false,
    isError: null,
  });
  
  const deletedFormRequest = (state, {payload}) => ({
    ...state,
    isLoading: true,
    isError: null,
  });
  const deletedFormError = (state , {payload}) => ({
    ...state,
    isLoading: false,
    isError: payload,
  });


  
export default {
  getdFormsSuccess,
  getdFormsRequest,
  getdFormsError,
  createdFormSuccess,
  createdFormRequest,
  createdFormError,
  updatedFormSuccess,
  updatedFormRequest,
  updatedFormError,
  deletedFormSuccess,
  deletedFormRequest,
  deletedFormError,
  };