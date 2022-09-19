import { toast } from "react-toastify";
import React, { useRef, useState } from "react";
import { Button, Card, Col, Row, Spinner } from "reactstrap";

import { FieldTypes } from "components/DForm";
import NmpSelect from "components/nmp/NmpSelect";

import UserOnboardingDForm from "../../../userOnboarding/UserOnboardingDForm";
import UserOnboardingForm from "../../../userOnboarding/UserOnboardingForm";

import { useDFormQuery, useDFormValues, useSubmitDFormMutation, useChangeDFormStatusMutation } from "../../userQueries";

const STATUSES = [
  { value: "submitted", label: "submitted" },
  { value: "approved", label: "approved" },
  { value: "rejected", label: "rejected" },
  { value: "unsubmitted", label: "unsubmitted" },
];

const UpdatedAt = ({ isUpdating, updatedAt }) => {
  if (isUpdating) {
    return (
      <div className="d-flex align-items-center">
        <div>Saving progress..</div>
        <Spinner className="ml-1" color="success" />
      </div>
    );
  }

  const formatted = updatedAt.substring(0, updatedAt.indexOf(".")).replace("T", " ");

  return <div>Progress saved: {formatted}</div>;
};

const UserEditApplication = ({ isCreate, dformId }) => {
  const editedFieldMasterSchemaFieldIdsRef = useRef([]);

  const [dform, setDForm] = useState(null);
  const [values, setValues] = useState(null);

  const dformQuery = useDFormQuery(
    { dformId },
    {
      onSuccess: (data) => setDForm(data),
      enabled: !isCreate && dformId != null,
      refetchOnWindowFocus: false,
    }
  );

  const valuesQuery = useDFormValues(
    { dformId },
    {
      onSuccess: (data) => {
        // When there are no values it returns empty object
        const values = typeof data === "object" ? data : {};
        setValues(values);
        // reset edited values
        clearEditedValues();
      },
      enabled: !isCreate && dformId != null,
      refetchOnWindowFocus: false,
    }
  );

  const changeDFormStatusMutation = useChangeDFormStatusMutation(
    { dformId },
    { onSuccess: () => toast.success("Status successfully changed") }
  );

  const submitDFormMutation = useSubmitDFormMutation({ dformId }, { onSuccess: () => toast.success("Saved") });

  const onFieldChange = (field, newValue) => {
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
        addFieldToEdited(field);
    }

    const newApplicationValue = { ...values, [field.masterSchemaFieldId]: newFieldValue };

    setValues(newApplicationValue);
  };

  const addFieldToEdited = ({ masterSchemaFieldId }) => {
    const edited = editedFieldMasterSchemaFieldIdsRef.current;
    if (!edited.includes(masterSchemaFieldId)) {
      editedFieldMasterSchemaFieldIdsRef.current.push(masterSchemaFieldId);
    }
  };

  const getFieldByMasterSchemaFieldId = (masterSchemaFieldId) => {
    const fields = Object.values(dform.schema.fields);
    return fields.find((field) => Number(field.masterSchemaFieldId) === Number(masterSchemaFieldId));
  };

  const getEditedFields = () => {
    return editedFieldMasterSchemaFieldIdsRef.current.map(getFieldByMasterSchemaFieldId);
  };

  const getEditedValue = (masterSchemaFieldId, values) => values[masterSchemaFieldId];

  const clearEditedValues = () => void (editedFieldMasterSchemaFieldIdsRef.current = []);

  const submitDForm = (editedFields) => {
    const editedValues = editedFields
      // File and FileList should not be submitted
      .filter(({ type }) => ![FieldTypes.File, FieldTypes.FileList].includes(type))
      .reduce((editedValues, { masterSchemaFieldId }) => {
        editedValues[masterSchemaFieldId] = getEditedValue(masterSchemaFieldId, values).value;
        return editedValues;
      }, {});

    submitDFormMutation.mutate({ values: editedValues });
  };

  const onSubmit = () => {
    const editedFields = getEditedFields();

    if (editedFields.length === 0) {
      toast.success("Form values up to date");
      return;
    }

    submitDForm(editedFields);
  };

  const onBeforeUnmount = () => {
    const editedFields = getEditedFields();

    if (editedFields.length > 0) {
      // Ask user if he wants to save changes before leave.
      const needSaveChanges = window.confirm("Save changes before leave?");

      if (needSaveChanges) {
        submitDForm(editedFields);
      }
    }
  };

  const onDFormStatusChange = ({ value: status }) => changeDFormStatusMutation.mutate({ status });

  const onRefetch = () => dformQuery.refetch();

  if (isCreate) {
    return (
      <div className="onboarding-create-feature mb-4 pb-4">
        <div className="onboarding-create-feature_header">
          <div className="onboarding-create-feature_header_title">Onboarding Create</div>
        </div>

        <Card className="px-1">
          <Row>
            <UserOnboardingForm isCreate />
          </Row>
        </Card>
      </div>
    );
  }

  return (
    <div className="onboarding-create-feature mb-4 pb-4">
      <div className="onboarding-create-feature_header">
        <div className="onboarding-create-feature_header_title">Application</div>
        <div className="onboarding-create-feature_header_name">{dform?.name ?? "Loading..."}</div>
      </div>
      <Card className="px-1">
        <Row>
          <UserOnboardingForm isCreate={false} />
        </Row>

        <Row>
          <UserOnboardingDForm
            dFormId={dform?.id}
            schema={dform?.schema}
            values={values}
            accessType={dform?.access_type}
            isLoading={dformQuery.isLoading || valuesQuery.isLoading}
            isManualSave
            onRefetch={onRefetch}
            onFieldChange={onFieldChange}
            onBeforeUnmount={onBeforeUnmount}
          />
        </Row>

        <Row className="align-items-center pb-2">
          <Col md="3" className="d-flex justify-content-center">
            <div style={{ width: "100%" }}>
              <NmpSelect
                value={dform ? { value: dform.status, label: dform.status } : null}
                options={STATUSES}
                loading={changeDFormStatusMutation.isLoading}
                onChange={onDFormStatusChange}
              />
            </div>
          </Col>

          <Col md="6" className="d-flex justify-content-center">
            <UpdatedAt updatedAt={dform?.updated_at} isUpdating={!dform || submitDFormMutation.isLoading} />
          </Col>

          <Col md="3" className="d-flex justify-content-end">
            <Button color="primary" onClick={onSubmit}>
              Save
            </Button>
          </Col>
        </Row>
      </Card>
    </div>
  );
};

export default UserEditApplication;
