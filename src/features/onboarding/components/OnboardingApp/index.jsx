import _ from "lodash";
import { Spinner } from "reactstrap";
import { toast } from "react-toastify";
import React, { useState, useRef, useEffect } from "react";

import {
  useDFormByIdQuery,
  useDFormsValuesByIdQuery,
  useSaveDFormFieldValue,
  useSubmitDFormForReviewMutation,
} from "api/Onboarding/prospectUserQuery";

import DForm from "components/DForm";
import LoadingButton from "components/LoadingButton";

import Check from "assets/img/icons/check.png";
import { DFormWidgetEventsTypes } from "../../../../components/DForm/Components/Fields/Components/DFormWidgets/events";

import { fieldValidationSchemas, textSchema } from "./validationOnboarding";

const OnboardingApp = ({ selectedForm, setRecentlySubmitted }) => {
  const [applicationSchema, setApplicationSchema] = useState(null);

  const [applicationValues, setApplicationValues] = useState(null);

  const appProperties =
    applicationSchema && applicationValues
      ? Object.values(applicationSchema.fields).map((app) => {
          return {
            value: applicationValues[app.masterSchemaPropertyId].value,
            ...app,
          };
        })
      : [];

  const { isLoading: isFormLoading } = useDFormByIdQuery(
    { id: selectedForm.id },
    {
      onSuccess: (data) => {
        const { schema, ...rest } = data;
        setApplicationSchema({ ...schema, ...rest });
      },
      refetchOnWindowFocus: false,
    }
  );

  const dFormValues = useDFormsValuesByIdQuery(
    { dFormId: selectedForm.id },
    {
      onSuccess: (data) => {
        setApplicationValues(data);
      },
      refetchOnWindowFocus: false,
    }
  );

  const saveDFormFieldValue = useSaveDFormFieldValue(
    { dFormId: selectedForm.id },
    {
      onError: () => {
        toast.error("Last changes in field doesn't saved");
      },
    }
  );

  const throttleOnSave = useRef(_.throttle((data) => saveDFormFieldValue.mutate(data), 1500, { leading: false }));

  const submitDFormForReview = useSubmitDFormForReviewMutation(
    { dFormId: selectedForm.id },
    {
      onSuccess: () => setRecentlySubmitted(true),
    }
  );

  const validateFieldsSubmit = (fields) => {
    const checkSubmit = fields.map((field) => {
      const selectedValidationSchema = fieldValidationSchemas[field.type];
      try {
        selectedValidationSchema.validateSync(field);
      } catch (validationError) {
        return { isValid: false, errors: validationError };
      }
      return { isValid: true };
    });
    return checkSubmit.find((el) => !el.isValid) ?? null;
  };

  const handleApplicationSubmit = () => {
    const checkFields = validateFieldsSubmit(appProperties);
    if (checkFields) {
      console.log("checkFields error", checkFields);
      toast.error(checkFields.errors.message);
    } else {
      submitDFormForReview.mutate();
    }
  };

  const validateFields = (field) => {
    const selectedValidationSchema = fieldValidationSchemas[field.type];
    try {
      selectedValidationSchema.validateSync(field);
    } catch (validationError) {
      return { isValid: false, errors: validationError };
    }
    return { isValid: true };
  };

  const handleFieldChangeEvent = (event) => {
    const { field, value } = event;

    setApplicationValues({
      ...applicationValues,
      [field.masterSchemaPropertyId]: { ...(applicationValues[field.masterSchemaPropertyId] || {}), value },
    });

    const { errors } = validateFields({ value, ...field });
    if (errors) {
      console.log("validateFields errors", errors);
      toast.error(errors.message);
    } else {
      throttleOnSave.current({ master_schema_field_id: field.masterSchemaPropertyId, value });
    }
  };

  const handleFieldEvent = (event) => {
    if (event.type === DFormWidgetEventsTypes.Change) {
      handleFieldChangeEvent(event);
    }
  };

  const isFormLocked = () => ~["user-lock", "hard-lock"].indexOf(applicationSchema?.access_type);

  // Immediately call save on component unmount if any save currently throttled
  useEffect(() => {
    return () => {
      throttleOnSave.current.flush();
    };
  }, []);

  if (isFormLoading || dFormValues.isLoading) {
    return (
      <div className="onboarding-survey_loading">
        <Spinner color="primary" size="40" />
      </div>
    );
  }

  // TODO handle loading with skeleton
  if (isFormLoading) return "Loading...";

  // TODO make dform disabled on user-lock
  return (
    <div>
      <DForm
        disabled={isFormLocked()}
        data={applicationSchema}
        values={applicationValues}
        onFieldEvent={handleFieldEvent}
        dFormId={applicationSchema.id}
        isMemberView
      />
      <div className="form-create__dform_actions pr-1">
        {applicationSchema.access_type !== "user-lock" && (
          <>
            <div className="saving">
              {saveDFormFieldValue.isLoading ? (
                "Saving"
              ) : (
                <div>
                  <img style={{ marginTop: "-2px", fontSize: "15px" }} src={Check} alt="" /> Saved
                </div>
              )}
              {/*{!!this.state?.uiSchema?.errors?.field.length && (*/}
              {/*  <div className={"submit-error-message"}>*/}
              {/*    Please fill in the missing fields highlighted in red!*/}
              {/*  </div>*/}
              {/*)}*/}
            </div>
            <div className={"d-flex align-items-center"} style={{ float: "right", paddingRight: "20px" }}>
              <span
                style={{
                  color: "#7367f0",
                  paddingRight: "10px",
                  maxWidth: 400,
                  display: "inline-block",
                  overflow: "hidden",
                  whiteSpace: "nowrap",
                  textOverflow: "ellipsis",
                }}
              >
                {applicationSchema.name}
              </span>
              <LoadingButton
                onClick={handleApplicationSubmit}
                value="Submit for review"
                isLoading={submitDFormForReview.isLoading}
                className="ml-auto submit-onboarding-button"
              />
            </div>
          </>
        )}

        {applicationSchema.status === "submitted" && (
          <div className="submitted-form-status">
            <span>{applicationSchema.name}</span> submitted for review
          </div>
        )}
      </div>
    </div>
  );

  // return formSelected?.d_form?.access_type === "user-lock" ? (
  //   <FormCreate
  //     isShowErrors={true}
  //     {...commonFormProps}
  //     inputDisabled={true}
  //     onSaveButtonHidden={isDisabledSubmit()}
  //     onboardingUser={profile}
  //     showSubmittedStatus
  //   />
  // ) : (
  //   <FormCreate
  //     isShowErrors={true}
  //     {...commonFormProps}
  //     inputDisabled={false}
  //     onSaveButtonHidden={true}
  //     onboardingUser={profile}
  //     onSubmit={(formData) => submitOnboardingForm(formData)}
  //     onChange={(data) => debounceOnSave.current(data)}
  //     updatedAtText={
  //       loading ? (
  //         "Saving"
  //       ) : (
  //         <div>
  //           <img style={{ marginTop: "-2px", fontSize: "15px" }} src={Check} alt="" /> Saved
  //         </div>
  //       )
  //     }
  //   />
  // );
};

export default OnboardingApp;
