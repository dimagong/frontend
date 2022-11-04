import _ from "lodash";
import { Col, Row, Spinner } from "reactstrap";
import { toast } from "react-toastify";
import React, { useState, useRef, useEffect } from "react";

import {
  useDFormQuery,
  useDFormValuesQuery,
  useSubmitDFormMutation,
  useSaveDFormFieldValueMutation,
} from "api/Onboarding/prospectUserQuery";

import LoadingButton from "components/LoadingButton";
import { BaseDForm, AccessTypes, FieldTypes } from "features/dform";

import Check from "assets/img/icons/check.png";

const OnboardingApp = ({ selectedForm, setRecentlySubmitted }) => {
  const dformId = selectedForm.id;

  const [dform, setDForm] = useState(null);
  const [values, setValues] = useState(null);

  const dformQuery = useDFormQuery(
    { dformId },
    {
      onSuccess: (data) => setDForm(data),
      refetchOnWindowFocus: false,
    }
  );

  const valuesQuery = useDFormValuesQuery(
    { dformId },
    {
      onSuccess: (data) => setValues(data),
      refetchOnWindowFocus: false,
    }
  );

  const saveFieldValueMutation = useSaveDFormFieldValueMutation(
    { dformId },
    {
      onError: () => void toast.error("Last changes in field doesn't saved"),
    }
  );

  const submitDFormMutation = useSubmitDFormMutation({ dformId }, { onSuccess: () => void setRecentlySubmitted(true) });

  const saveFieldValueRef = useRef(_.throttle((v) => saveFieldValueMutation.mutate(v), 1500, { leading: false }));

  const saveFieldValue = (v) => saveFieldValueRef.current(v);

  const flushFieldValue = () => saveFieldValueRef.current.flush();

  /*
  const appProperties =
  applicationSchema && applicationValues
    ? Object.values(applicationSchema.fields).map((app) => {
        return {
          value: applicationValues[app.masterSchemaFieldId].value,
          ...app,
        };
      })
    : [];

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

  const validateFields = (field) => {
    const selectedValidationSchema = fieldValidationSchemas[field.type];
    try {
      selectedValidationSchema.validateSync(field);
    } catch (validationError) {
      return { isValid: false, errors: validationError };
    }
    return { isValid: true };
  };
  */

  const handleFieldChange = (field, newValue) => {
    let newFieldValue;
    const currentValue = values[field.masterSchemaFieldId];

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

    const newApplicationValue = { ...values, [field.masterSchemaFieldId]: newFieldValue };

    setValues(newApplicationValue);

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

    saveFieldValue({ master_schema_field_id: field.masterSchemaFieldId, value: newValue });
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
    submitDFormMutation.mutate();
  };

  // Immediately call save on component unmount if any save currently throttled
  useEffect(() => () => flushFieldValue(), []);

  if (dformQuery.isLoading || dform == null || valuesQuery.isLoading || values == null) {
    return (
      <div className="onboarding-survey_loading">
        <Spinner color="primary" size="40" />
      </div>
    );
  }

  return (
    <>
      <BaseDForm
        schema={dform.schema}
        values={values}
        dFormId={dform.id}
        accessType={dform.access_type}
        isMemberView
        onFieldChange={handleFieldChange}
      />

      {dform.access_type !== AccessTypes.UserLock ? (
        <>
          <Row className="py-1">
            <Col className="d-flex justify-content-end">
              <LoadingButton
                color="primary"
                onClick={handleApplicationSubmit}
                value="Submit for review"
                isLoading={submitDFormMutation.isLoading}
                className="ml-auto submit-onboarding-button"
              />
            </Col>
          </Row>

          <Row className="py-1">
            <Col className="d-flex justify-content-end">
              <div
                style={{
                  color: "#7367f0",
                  maxWidth: 400,
                  overflow: "hidden",
                  whiteSpace: "nowrap",
                  textOverflow: "ellipsis",
                }}
                className="pr-1"
              >
                {dform.name}
              </div>

              <div>
                {saveFieldValueMutation.isLoading ? (
                  <span>Saving</span>
                ) : (
                  <>
                    <span>Saved</span>
                    <img className="pl-1" src={Check} alt="Saved icon" />
                  </>
                )}
              </div>
            </Col>
          </Row>
        </>
      ) : null}

      {dform.status === "submitted" ? (
        <Row className="py-1">
          <Col className="d-flex justify-content-end">
            <div
              style={{
                color: "#7367f0",
                maxWidth: 400,
                overflow: "hidden",
                whiteSpace: "nowrap",
                textOverflow: "ellipsis",
              }}
              className="pr-1"
            >
              {dform.name}
            </div>
            <div>submitted for review</div>
          </Col>
        </Row>
      ) : null}
    </>
  );
};

export default OnboardingApp;
