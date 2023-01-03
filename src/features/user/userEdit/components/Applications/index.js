import { toast } from "react-toastify";
import React, { useMemo, useRef, useState } from "react";
import { Button, Card, Col, Row, Spinner } from "reactstrap";
import _ from "lodash";

import { FieldTypes } from "components/DForm";
import { NmpSelect } from "features/nmp-ui";

import UserOnboardingDForm from "../../../userOnboarding/UserOnboardingDForm";
import UserOnboardingForm from "../../../userOnboarding/UserOnboardingForm";

import {
  useDFormQuery,
  useDFormValues,
  useSubmitDFormMutation,
  useChangeDFormStatusMutation,
  useSaveUserValueDFormMutation,
} from "../../userQueries";

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
  const prevValuesRef = useRef({});

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
        const values = typeof data === "object" && data !== null ? data : {};
        setValues(values);
        prevValuesRef.current = values;
      },
      select: (data) => (typeof data === "object" && data !== null ? data : {}),
      enabled: !isCreate && dformId != null,
      refetchOnWindowFocus: false,
    }
  );

  const isEdited = useMemo(() => !_.isEqual(values, valuesQuery.data), [valuesQuery.data, values]);

  const changeDFormStatusMutation = useChangeDFormStatusMutation(
    { dformId },
    { onSuccess: () => toast.success("Status successfully changed") }
  );

  const submitDFormMutation = useSubmitDFormMutation({ dformId }, { onSuccess: () => toast.success("Saved") });

  const saveValueMutation = useSaveUserValueDFormMutation(
    { dformId },
    {
      onError: (error, vars) => {
        const masterSchemaFieldId = vars.master_schema_field_id;
        const prevValue = { ...prevValuesRef.current[masterSchemaFieldId] };
        setValues((prev) => ({ ...prev, [masterSchemaFieldId]: prevValue }));
      },
    }
  );

  const isSaveDisabled =
    [dformQuery, valuesQuery, changeDFormStatusMutation, submitDFormMutation, saveValueMutation].every(
      ({ isLoading }) => isLoading
    ) || !isEdited;

  const onFieldChange = (field, newValue) => {
    let newFieldValue;
    const currentValue = values[field.masterSchemaFieldId];

    switch (field.type) {
      case FieldTypes.File:
      case FieldTypes.FileList:
        const newFiles = Array.isArray(newValue) ? newValue : [];
        newFieldValue = { ...currentValue, files: newFiles };
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

    prevValuesRef.current = values;
    setValues(newApplicationValue);

    // File and FileList should not be saved here.
    if ([FieldTypes.File, FieldTypes.FileList].includes(field.type)) {
      return;
    }

    saveValueMutation.mutate({
      master_schema_field_id: field.masterSchemaFieldId,
      value: newFieldValue.value,
    });
  };

  const onSubmit = () => {
    if (!isEdited) {
      toast.success("Form values up to date");
      return;
    }

    submitDFormMutation.mutate();
  };

  const onBeforeUnmount = () => {
    if (isEdited) {
      // Ask user if he wants to save changes before leave.
      const needSaveChanges = window.confirm("Save changes before leave?");

      if (needSaveChanges) {
        submitDFormMutation.mutate();
      }
    }
  };

  const onDFormStatusChange = (status) => {
    if (isEdited) {
      toast.warn("Please save your changes.");
      return;
    }

    changeDFormStatusMutation.mutate({ status });
  };

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
    <div className="onboarding-create-feature">
      <div className="onboarding-create-feature_header">
        <div className="onboarding-create-feature_header_title">Application</div>
        <div className="onboarding-create-feature_header_name">{dform?.name ?? "Loading..."}</div>
      </div>
      <Card className="px-1 mb-0" style={{ position: "relative" }}>
        <Row>
          <UserOnboardingForm isCreate={false} />
        </Row>

        <Row>
          <UserOnboardingDForm
            dFormId={dform?.id}
            schema={dform?.schema}
            values={values}
            accessType={dform?.access_type}
            isLoading={dformQuery.isLoading || dformQuery.isFetching || valuesQuery.isLoading}
            isManualSave
            onRefetch={onRefetch}
            onFieldChange={onFieldChange}
            onBeforeUnmount={onBeforeUnmount}
          />
        </Row>

        <Row
          className="align-items-center py-2 bg-white"
          style={{ position: "sticky", bottom: 0, left: 0, right: 0, boxShadow: "0px 0px 5px 0px rgb(0 0 0 / 20%)" }}
        >
          <Col md="3" className="d-flex justify-content-center">
            <div style={{ width: "100%" }}>
              <NmpSelect
                value={dform ? { value: dform.status, label: dform.status } : null}
                options={STATUSES}
                loading={changeDFormStatusMutation.isLoading}
                onChange={onDFormStatusChange}
                className="w-100"
                placeholder="Select an option"
                placement="topLeft"
              />
            </div>
          </Col>

          <Col md="6" className="d-flex justify-content-center">
            <UpdatedAt updatedAt={dform?.updated_at} isUpdating={!dform || submitDFormMutation.isLoading} />
          </Col>

          <Col md="3" className="d-flex justify-content-end">
            <Button color="primary" onClick={onSubmit} disabled={isSaveDisabled}>
              Save
            </Button>
          </Col>
        </Row>
      </Card>
    </div>
  );
};

export default UserEditApplication;
