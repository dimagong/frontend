import { isEmpty } from "lodash";
import { toast } from "react-toastify";

const getdFormsSuccess = (state) => {
  state.isLoading = false;
  state.isError = null;
};

const createDFormTemplateSuccess = (state) => {
  state.isLoading = false;
  state.isError = null;
  toast.success("Created");
};

const updateDFormTemplateSuccess = (state) => {
  state.isLoading = false;
  state.isError = null;
  toast.success("Saved");
};

const updateDFormSuccess = (state, { payload }) => {
  // todo user.manager? refactor
  const onboardingFound = state.user.manager.onboardings.find((onboarding) => onboarding.d_form.id === payload.id);

  if (onboardingFound) {
    onboardingFound.d_form = payload;
  }

  state.isLoading = false;
  state.isError = null;
};

const deletedFormSuccess = (state) => {
  state.isLoading = false;
  state.isError = null;
};

const getdFormActionsSuccess = (state) => {
  state.isLoading = false;
  state.isError = null;
};

const getdFormTriggersSuccess = (state) => {
  state.isLoading = false;
  state.isError = null;
};

const getSurveyTriggersSuccess = (state) => {
  state.isLoading = false;
  state.isError = null;
};

const submitdFormSuccess = (state, { payload }) => {
  state.isLoading = false;
  state.isError = null;
  const dFormIndex = state.user.profile.onboardings.findIndex((onboarding) => onboarding.d_form.id === payload.id);
  state.user.profile.onboardings[dFormIndex].d_form = payload;

  state.user.profile.onboarding.d_form = payload;
  toast.success("Submitted for review");
};

const submitdFormNewVersionSuccess = (state, { payload }) => {
  state.isLoading = false;
  state.isError = null;

  const { managerId, ...dform } = payload;

  state.user.manager.onboarding.d_form = dform;

  const managerIndex = state.user.managers.findIndex((item) => item.id === managerId);

  const managerOnboardingIndex = state.user.managers[managerIndex].onboardings.findIndex(
    (onboarding) => onboarding.d_form.id === dform.id
  );
  state.user.managers[managerIndex].onboardings[managerOnboardingIndex].d_form = dform;
};

const submitdFormDataSuccess = (state, { payload }) => {
  state.isLoading = false;
  state.isError = null;
  // TODO SO STRANGE BUG FIRST FOR PROSPECT VIEW SECOND FOR DFORM VIEW FOR MANAGER (FIXED)

  if (!isEmpty(state.user.profile.onboarding)) {
    state.user.profile.onboarding.d_form = payload;
    state.user.profile.onboardings.some((onboarding) => {
      if (onboarding.d_form.id === payload.id) {
        onboarding.d_form = payload;
        return true;
      }
      return false;
    });
  } else {
    state.user.manager.onboardings.some((onboarding) => {
      if (onboarding.d_form.id === payload.id) {
        onboarding.d_form = payload;
        return true;
      }
      return false;
    });

    state.user.managers.forEach((nextManager) => {
      nextManager.onboardings &&
        nextManager.onboardings.some((onboarding) => {
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

const changedFormStatusSuccess = (state, { payload }) => {
  state.user.manager.onboarding.d_form.status = payload.status;
  const onboardingFound = state.user.manager.onboardings.find(
    (onboarding) => onboarding.d_form.id === payload.dForm.id
  );
  if (onboardingFound) {
    onboardingFound.d_form.status = payload.status;

    state.user.managers.forEach((nextManager) => {
      nextManager.onboardings &&
        nextManager.onboardings.some((onboarding) => {
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

const updateDFormFromParentSuccess = (state, { payload }) => {
  state.isLoading = false;
  state.isError = null;

  // todo maybe refactor
  state.user.manager.onboardings = [];

  state.user.manager.onboardings.some((onboarding) => {
    if (onboarding.d_form.id === payload.id) {
      onboarding.d_form = payload;
      return true;
    }
    return false;
  });
  state.user.managers.forEach((nextManager) => {
    nextManager.onboardings &&
      nextManager.onboardings.some((onboarding) => {
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

export default {
  getdFormsSuccess,
  updateDFormSuccess,
  createDFormTemplateSuccess,
  updateDFormTemplateSuccess,
  deletedFormSuccess,
  getdFormActionsSuccess,
  getdFormTriggersSuccess,
  submitdFormSuccess,
  submitdFormNewVersionSuccess,
  submitdFormDataSuccess,
  changedFormStatusSuccess,
  updateDFormFromParentSuccess,

  getSurveyTriggersSuccess,
};
