import React, { useRef } from "react";
import FormCreate from "components/FormCreate/FormCreate";
import {
  useSubmitdFormDataRequestMutation,
  useSubmitdFormPathRequestMutation,
  useAppsOnboardingIdQuery,
} from "api/Onboarding/prospectUserQuery";
import Check from "assets/img/icons/check.png";

const OnboardingApp = ({ profile, appOnboardingSelected, setRecentlySubmitted }) => {
  const isDisabledSubmit = () => {
    // return ["user-lock", "hard-lock"].indexOf(profile.onboarding.d_form?.access_type) !== -1;
    return ["user-lock", "hard-lock"].indexOf(appOnboardingSelected.d_form?.access_type) !== -1;
  };

  const isShowProtectedElements = (roles) => {
    return !roles.some((role) => ["corporate_manager", "member_firm_manager", "member", "admin"].indexOf(role) !== -1);
  };

  const commonFormProps = {
    isShowProtectedElements: isShowProtectedElements(profile.roles),
    fileLoader: true,
    fill: true,
    dForm: appOnboardingSelected.d_form,
    isStateConfig: false,
  };

  const submitdForm = useSubmitdFormPathRequestMutation();
  const submitOnboardingForm = (data) => {
    console.log("submitOnboardingForm data", data);
    setRecentlySubmitted(true);
    // dispatch(submitdFormRequest({ dForm: profile.onboarding.d_form, data }));
    submitdForm.mutate({ dForm: appOnboardingSelected.d_form, data });
  };

  const debounceonSaveMutation = useSubmitdFormDataRequestMutation();
  const loading = debounceonSaveMutation.isLoading;
  const debounceOnSave = useRef((data, dForm) => {
    //dispatch(submitdFormDataRequest({ data, dForm }))
    debounceonSaveMutation.mutate({ data, dForm });
  });

  return appOnboardingSelected.d_form.access_type === "user-lock" ? (
    <FormCreate
      isShowErrors={true}
      {...commonFormProps}
      inputDisabled={true}
      onSaveButtonHidden={isDisabledSubmit()}
      onboardingUser={profile}
      showSubmittedStatus
    />
  ) : (
    <FormCreate
      isShowErrors={true}
      {...commonFormProps}
      inputDisabled={false}
      onSaveButtonHidden={true}
      onboardingUser={profile}
      onSubmit={(formData) => submitOnboardingForm(formData)}
      onChange={(data) => {
        // setDebounced(true);
        debounceOnSave.current(data, appOnboardingSelected.d_form);
      }}
      updatedAtText={
        loading ? (
          "Saving"
        ) : (
          <div>
            <img style={{ marginTop: "-2px", fontSize: "15px" }} src={Check} alt="" /> Saved
          </div>
        )
      }
    />
  );
};

export default OnboardingApp;
