const getdFormsSuccess = (state) => ({
  ...state,
  isLoading: false,
  isError: null,
});
const getdFormsRequest = (state, {payload}) => {
  state.isLoading = true;
  state.isError = null;
};
const getdFormsError = (state , {payload}) => {
  state.isLoading = false;
  state.isError = payload;
};

const createdFormSuccess = (state) => {
  state.isLoading = false;
  state.isError = null;
};
const createdFormRequest = (state, {payload}) => {
  state.isLoading = true;
  state.isError = null;
};
const createdFormError = (state , {payload}) => {
  state.isLoading = false;
  state.isError = payload;
};

const updatedFormSuccess = (state) => {
  state.isLoading = false;
  state.isError = null;
};

const updatedFormRequest = (state, {payload}) => {
  state.isLoading = true;
  state.isError = null;
};
const updatedFormError = (state , {payload}) => {
  state.isLoading = false;
  state.isError = payload;
};

const deletedFormSuccess = (state) => {
  state.isLoading = false;
  state.isError = null;
};

const deletedFormRequest = (state, {payload}) => {
  state.isLoading = true;
  state.isError = null;
};
const deletedFormError = (state , {payload}) => {
  state.isLoading = false;
  state.isError = payload;
};
const getdFormActionsSuccess = (state) => {
  state.isLoading = false;
  state.isError = null;
};

const getdFormActionsRequest = (state, {payload}) => {
  state.isLoading = true;
  state.isError = null;
};
const getdFormActionsError = (state , {payload}) => {
  state.isLoading = false;
  state.isError = payload;
};
const getdFormTriggersSuccess = (state) => {
  state.isLoading = false;
  state.isError = null;
};

const getdFormTriggersRequest = (state, {payload}) => {
  state.isLoading = true;
  state.isError = null;
};
const getdFormTriggersError = (state, {payload}) => {
  state.isLoading = false;
  state.isError = payload;
};
const submitdFormSuccess = (state, {payload}) => {
  state.isLoading = false;
  state.isError = null;
  const result = state.user.profile.onboardings.some(onboarding => {
    if(onboarding.d_form.id === payload.id) {
      onboarding.d_form = payload;
      return true;
    }
    return false;
  });
  state.user.profile.onboarding.d_form = payload;
};

const submitdFormRequest = (state, {payload}) => {
  state.isLoading = true;
  state.isError = null;
};
const submitdFormError = (state , {payload}) => {
  state.isLoading = false;
  state.isError = payload;
};
const submitdFormDataSuccess = (state, {payload}) => {
  state.isLoading = false;
  state.isError = null;
  const result = state.user.profile.onboardings.some(onboarding => {
    if(onboarding.d_form.id === payload.id) {
      onboarding.d_form = payload;
      return true;
    }
    return false;
  });
  state.user.profile.onboarding.d_form = payload;
};

const submitdFormDataRequest = (state, {payload}) => {
  state.isLoading = true;
  state.isError = null;
};
const submitdFormDataError = (state , {payload}) => {
  state.isLoading = false;
  state.isError = payload;
};
const changedFormStatusSuccess = (state) => {
  state.isLoading = false;
  state.isError = null;
};

const changedFormStatusRequest = (state, {payload}) => {
  state.isLoading = true;
  state.isError = null;
};
const changedFormStatusError = (state , {payload}) => {
  state.isLoading = false;
  state.isError = payload;
};


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
