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

import LoadingButton from "components/LoadingButton";
import { DForm, AccessTypes, FieldTypes } from "components/DForm";

import Check from "assets/img/icons/check.png";

import { fieldValidationSchemas } from "./validationOnboarding";

const OnboardingApp = ({ selectedForm, setRecentlySubmitted }) => {
  const [applicationData, setApplicationData] = useState(null);
  console.log("applicationData", applicationData);

  const [applicationValues, setApplicationValues] = useState(null);
  console.log("applicationValues", applicationValues);
  /*const appProperties =
    applicationSchema && applicationValues
      ? Object.values(applicationSchema.fields).map((app) => {
          return {
            value: applicationValues[app.masterSchemaFieldId].value,
            ...app,
          };
        })
      : [];*/

  const { isLoading: isFormLoading } = useDFormByIdQuery(
    { id: selectedForm.id },
    {
      onSuccess: (data) => {
        const { schema, ...rest } = data;
        setApplicationData({ ...schema, ...rest });
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
    // ToDo: turn on validation
    /*const checkFields = validateFieldsSubmit(appProperties);
    if (checkFields) {
      console.log("checkFields error", checkFields);
      toast.error(checkFields.errors.message);
    } else {
      submitDFormForReview.mutate();
    }*/
    submitDFormForReview.mutate();
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

  const handleFieldChange = (field, newValue) => {
    let newFieldValue;
    const currentValue = applicationValues[field.masterSchemaFieldId];

    switch (field.type) {
      case FieldTypes.File:
      case FieldTypes.FileList:
        newFieldValue = { ...currentValue, files: newValue };
        break;
      case FieldTypes.Text:
      case FieldTypes.TextArea:
      case FieldTypes.LongText:
      case FieldTypes.Date:
      case FieldTypes.Number:
      case FieldTypes.Boolean:
      case FieldTypes.Select:
      case FieldTypes.MultiSelect:
      default:
        newFieldValue = { ...currentValue, value: newValue };
    }

    const newApplicationValue = { ...applicationValues, [field.masterSchemaFieldId]: newFieldValue };

    setApplicationValues(newApplicationValue);

    // ToDo: turn on validation
    /*const { errors } = validateFields({ value, ...field });
    if (errors) {
      console.log("validateFields errors", errors);
      toast.error(errors.message);
    } else {
      throttleOnSave.current({ master_schema_field_id: field.masterSchemaFieldId, value });
    }*/

    // Do not save Files
    if ([FieldTypes.File, FieldTypes.FileList].includes(field.type)) return;

    throttleOnSave.current({ master_schema_field_id: field.masterSchemaFieldId, value: newValue });
  };

  // TODO make dform disabled on user-lock
  // const isFormLocked = () => ~["user-lock", "hard-lock"].indexOf(applicationSchema?.access_type);

  // Immediately call save on component unmount if any save currently throttled
  useEffect(() => {
    // eslint-disable-next-line react-hooks/exhaustive-deps
    return () => throttleOnSave.current.flush();
  }, []);

  if (isFormLoading || dFormValues.isLoading) {
    return (
      <div className="onboarding-survey_loading">
        <Spinner color="primary" size="40" />
      </div>
    );
  }

  return (
    <div>
      <DForm
        isMemberView
        data={applicationData}
        values={applicationValues}
        dFormId={applicationData.id}
        accessType={applicationData.access_type}
        onFieldChange={handleFieldChange}
      />

      <div className="form-create__dform_actions pr-1">
        {applicationData.access_type !== AccessTypes.UserLock ? (
          <>
            <div className="saving">
              {saveDFormFieldValue.isLoading ? (
                "Saving"
              ) : (
                <div>
                  <img style={{ marginTop: "-2px", fontSize: "15px" }} src={Check} alt="" /> Saved
                </div>
              )}
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
                {applicationData.name}
              </span>
              <LoadingButton
                onClick={handleApplicationSubmit}
                value="Submit for review"
                isLoading={submitDFormForReview.isLoading}
                className="ml-auto submit-onboarding-button"
              />
            </div>
          </>
        ) : null}

        {applicationData.status === "submitted" ? (
          <div className="submitted-form-status">
            <span>{applicationData.name}</span> submitted for review
          </div>
        ) : null}
      </div>
    </div>
  );
};

export default OnboardingApp;
