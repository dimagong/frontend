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
  const getdFormActionsSuccess = (state) => ({
    ...state,
    isLoading: false,
    isError: null,
  });
  
  const getdFormActionsRequest = (state, {payload}) => ({
    ...state,
    isLoading: true,
    isError: null,
  });
  const getdFormActionsError = (state , {payload}) => ({
    ...state,
    isLoading: false,
    isError: payload,
  });
  const getdFormTriggersSuccess = (state) => ({
    ...state,
    isLoading: false,
    isError: null,
  });
  
  const getdFormTriggersRequest = (state, {payload}) => ({
    ...state,
    isLoading: true,
    isError: null,
  });
  const getdFormTriggersError = (state, {payload}) => ({
    ...state,
    isLoading: false,
    isError: payload,
  });
  const submitdFormSuccess = (state, {payload}) => ({
    ...state,
    isLoading: false,
    isError: null,
    user: {
      ...state.user,
      manager: {
        ...state.user.manager,
        onboarding : {...state.user.manager.onboarding, d_form: payload}
      },
      managers: state.user.managers.map( manager => manager.id === state.user.manager.id ? {
        ...state.user.manager,
        onboarding : {...state.user.manager.onboarding, d_form: payload}
      } : manager)
    }
    
  });
  
  const submitdFormRequest = (state, {payload}) => ({
    ...state,
    isLoading: true,
    isError: null,
  });
  const submitdFormError = (state , {payload}) => ({
    ...state,
    isLoading: false,
    isError: payload,
  });
  const submitdFormDataSuccess = (state, {payload}) => ({
    ...state,
    isLoading: false,
    isError: null,
  });
  
  const submitdFormDataRequest = (state, {payload}) => ({
    ...state,
    isLoading: true,
    isError: null,
  });
  const submitdFormDataError = (state , {payload}) => ({
    ...state,
    isLoading: false,
    isError: payload,
  });
  const changedFormStatusSuccess = (state) => ({
    ...state,
    isLoading: false,
    isError: null,
  });
  
  const changedFormStatusRequest = (state, {payload}) => ({
    ...state,
    isLoading: true,
    isError: null,
  });
  const changedFormStatusError = (state , {payload}) => ({
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
  getdFormActionsSuccess,
  getdFormActionsRequest,
  getdFormActionsError,
  getdFormTriggersSuccess,
  getdFormTriggersRequest,
  getdFormTriggersError,
  submitdFormSuccess,
  submitdFormRequest,
  submitdFormError,
  submitdFormDataSuccess,
  submitdFormDataRequest,
  submitdFormDataError,
  changedFormStatusSuccess,
  changedFormStatusRequest,
  changedFormStatusError,
  };