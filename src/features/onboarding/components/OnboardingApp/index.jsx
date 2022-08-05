import React, { useRef } from "react";
import { Spinner } from "reactstrap";

import {
  useSubmitDFormDataRequestMutation,
  useSubmitDFormPathRequestMutation,
  useDFormByIdQuery,
} from "api/Onboarding/prospectUserQuery";

import FormCreate from "components/FormCreate/FormCreate";
import Check from "assets/img/icons/check.png";

const OnboardingApp = ({ profile, selectedForm, setRecentlySubmitted }) => {
  const { data: formSelected, isLoading: isFormLoading } = useDFormByIdQuery({ id: selectedForm.id });

  const isDisabledSubmit = () => {
    return ["user-lock", "hard-lock"].indexOf(formSelected.d_form?.access_type) !== -1;
  };

  const isShowProtectedElements = (roles) => {
    return !roles.some((role) => ["corporate_manager", "member_firm_manager", "member", "admin"].indexOf(role) !== -1);
  };

  const commonFormProps = {
    isShowProtectedElements: isShowProtectedElements(profile?.roles || []),
    fileLoader: true,
    fill: true,
    dForm: formSelected?.d_form,
    isStateConfig: false,
  };

  const submitdForm = useSubmitDFormPathRequestMutation();
  const submitOnboardingForm = (data) => {
    setRecentlySubmitted(true);
    submitdForm.mutate({ dForm: formSelected.d_form, data });
  };

  const debounceonSaveMutation = useSubmitDFormDataRequestMutation();
  const loading = debounceonSaveMutation.isLoading;
  const debounceOnSave = useRef((data, dForm) => {
    debounceonSaveMutation.mutate({ data, dForm });
  });

  if (isFormLoading) {
    return (
      <div className="onboarding-survey_loading">
        <Spinner color="primary" size="40" />
      </div>
    );
  }

  return formSelected?.d_form?.access_type === "user-lock" ? (
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
        debounceOnSave.current(data, formSelected.d_form);
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
