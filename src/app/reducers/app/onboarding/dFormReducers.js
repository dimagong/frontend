import {isEmpty} from 'lodash'
import rfdc from "rfdc";
import {toast} from 'react-toastify'

const clone = rfdc();
const getdFormsSuccess = (state) => {
  state.isLoading = false;
  state.isError = null;
};
const getdFormsRequest = (state, {payload}) => {
  state.isLoading = true;
  state.isError = null;
};
const getdFormsError = (state, {payload}) => {
  state.isLoading = false;
  state.isError = payload;
};

const createDFormTemplateSuccess = (state) => {
  state.isLoading = false;
  state.isError = null;
  toast.success("Created")
};
const createDFormTemplateRequest = (state, {payload}) => {
  state.isLoading = true;
  state.isError = null;
};
const createDFormTemplateError = (state, {payload}) => {
  state.isLoading = false;
  state.isError = payload;
};

const updateDFormTemplateSuccess = (state) => {
  state.isLoading = false;
  state.isError = null;
  toast.success("Saved")
};

const updateDFormTemplateRequest = (state, {payload}) => {
  state.isLoading = true;
  state.isError = null;
};

const updateDFormSuccess = (state, {payload}) => {

  // todo user.manager? refactor
  const onboardingFound = state.user.manager.onboardings.find(onboarding => onboarding.d_form.id === payload.id);

  if (onboardingFound) {
    onboardingFound.d_form = payload;
  }

  state.isLoading = false;
  state.isError = null;
};

const updateDFormRequest = (state, {payload}) => {
  state.isLoading = true;
  state.isError = null;
};
const updateDFormError = (state, {payload}) => {
  state.isLoading = false;
  state.isError = payload;
};

const updateDFormTemplateError = (state, {payload}) => {
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
const deletedFormError = (state, {payload}) => {
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
const getdFormActionsError = (state, {payload}) => {
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
  const dFormIndex = state.user.profile.onboardings.findIndex(onboarding => onboarding.d_form.id === payload.id)
  state.user.profile.onboardings[dFormIndex].d_form = payload;

  state.user.profile.onboarding.d_form = payload;
  toast.success("Submitted for review")
};

const submitdFormRequest = (state, {payload}) => {
  state.isLoading = true;
  state.isError = null;
};
const submitdFormError = (state, {payload}) => {
  state.isLoading = false;
  state.isError = payload;
};
const submitdFormDataSuccess = (state, {payload}) => {
  state.isLoading = false;
  state.isError = null;
  // TODO SO STRANGE BUG FIRST FOR PROSPECT VIEW SECOND FOR DFORM VIEW FOR MANAGER (FIXED)

  if (!isEmpty(state.user.profile.onboarding)) {
    state.user.profile.onboarding.d_form = payload;
    const result = state.user.profile.onboardings.some(onboarding => {
      if (onboarding.d_form.id === payload.id) {
        onboarding.d_form = payload;
        return true;
      }
      return false;
    });

  } else {
    state.user.manager.onboardings.some(onboarding => {
      if (onboarding.d_form.id === payload.id) {
        onboarding.d_form = payload;
        return true;
      }
      return false;
    });

    state.user.managers.forEach(nextManager => {
      nextManager.onboardings && nextManager.onboardings.some(onboarding => {
        if (onboarding.d_form.id === payload.id) {
          onboarding.d_form = payload;
          return true;
        }
        return false;
      });
    });

    state.user.manager.onboarding.d_form = payload;
  }

};

const submitdFormDataRequest = (state, {payload}) => {
  state.isLoading = true;
  state.isError = null;
};
const submitdFormDataError = (state, {payload}) => {
  state.isLoading = false;
  state.isError = payload;
};
const changedFormStatusSuccess = (state, {payload}) => {

  state.user.manager.onboarding.d_form.status = payload.status;
  const onboardingFound = state.user.manager.onboardings.find(onboarding => onboarding.d_form.id === payload.dForm.id);
  if (onboardingFound) {
    onboardingFound.d_form.status = payload.status;

    state.user.managers.forEach(nextManager => {
      nextManager.onboardings && nextManager.onboardings.some(onboarding => {
        if (onboarding.d_form.id === onboardingFound.d_form.id) {
          onboarding.d_form.status = payload.status;
          return true;
        }
        return false;
      });
    });
  }



  state.isLoading = false;
  state.isError = null;
};

const changedFormStatusRequest = (state, {payload}) => {
  state.isLoading = true;
  state.isError = null;
};
const changedFormStatusError = (state, {payload}) => {
  state.isLoading = false;
  state.isError = payload;
};

const updateDFormFromParentRequest = (state, {payload}) => {
  state.isLoading = true;
  state.isError = null;
};

const updateDFormFromParentSuccess = (state, {payload}) => {
  state.isLoading = false;
  state.isError = null;

  // todo maybe refactor
  state.user.manager.onboardings = [];

  state.user.manager.onboardings.some(onboarding => {
    if (onboarding.d_form.id === payload.id) {
      onboarding.d_form = payload;
      return true;
    }
    return false;
  });
  state.user.managers.forEach(nextManager => {
    nextManager.onboardings && nextManager.onboardings.some(onboarding => {
      if (onboarding.d_form.id === payload.id) {
        onboarding.d_form = payload;
        return true;
      }
      return false;
    });
  });
  if (state.user.manager.onboarding) {
    state.user.manager.onboarding.d_form = payload;
  }
};

const updateDFormFromParentError = (state, {payload}) => {
  state.isLoading = false;
  state.isError = payload;
};


export default {
  getdFormsSuccess,
  getdFormsRequest,
  getdFormsError,

  updateDFormRequest,
  updateDFormSuccess,
  updateDFormError,

  createDFormTemplateSuccess,
  createDFormTemplateRequest,
  createDFormTemplateError,
  updateDFormTemplateSuccess,
  updateDFormTemplateRequest,
  updateDFormTemplateError,
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

  updateDFormFromParentRequest,
  updateDFormFromParentSuccess,
  updateDFormFromParentError
};
