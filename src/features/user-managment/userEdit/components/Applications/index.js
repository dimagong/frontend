import Select from "react-select";
import { toast } from "react-toastify";
import { Button, Card } from "reactstrap";
import React, { useEffect, useRef, useState } from "react";

import {
  useUserApplication,
  useUserApplicationStatusMutation,
  useUserApplicationValues,
  useUserApplicationValuesMutation,
} from "../../userQueries";

import UserOnboardingDForm from "../../../userOnboarding/UserOnboardingDForm";
import UserOnboardingForm from "../../../userOnboarding/UserOnboardingForm";
import { FieldTypes } from "../../../../../components/DForm";

const STATUSES = [
  { value: "submitted", label: "submitted" },
  { value: "approved", label: "approved" },
  { value: "rejected", label: "rejected" },
  { value: "unsubmitted", label: "unsubmitted" },
];

const UserEditApplication = ({ isCreate, selectedApplicationId }) => {
  const editedApplicationValuesRef = useRef([]);
  const [applicationValues, setApplicationValues] = useState({});
  const [applicationData, setApplicationData] = useState(isCreate ? {} : null);

  const userApplication = useUserApplication(
    { userApplicationId: selectedApplicationId },
    {
      onSuccess: (data) => setApplicationData(data),
      enabled: !isCreate,
      refetchOnWindowFocus: false,
    }
  );

  const userApplicationValues = useUserApplicationValues(
    { userApplicationId: selectedApplicationId },
    {
      onSuccess: (data) => {
        // When there are no values it returns empty object
        const applicationValues = typeof data === "object" ? data : {};
        setApplicationValues(applicationValues);
        // reset edited values
        editedApplicationValuesRef.current = [];
      },
      enabled: !isCreate,
      refetchOnWindowFocus: false,
    }
  );

  const updateUserApplicationStatus = useUserApplicationStatusMutation(
    { userApplicationId: selectedApplicationId },
    { onSuccess: () => toast.success("Status successfully changed") }
  );

  const updateUserApplicationValues = useUserApplicationValuesMutation(
    { userApplicationId: selectedApplicationId },
    { onSuccess: () => toast.success("Saved") }
  );

  useEffect(() => {
    setApplicationData(isCreate ? {} : null);
    setApplicationValues({});
  }, [isCreate, selectedApplicationId]);

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

    editedApplicationValuesRef.current.push(field.masterSchemaFieldId);

    const newApplicationValue = { ...applicationValues, [field.masterSchemaFieldId]: newFieldValue };

    setApplicationValues(newApplicationValue);
  };

  const handleUserApplicationValuesUpdate = () => {
    const editedValues = editedApplicationValuesRef.current.map((id) => applicationValues[id]);

    if (editedValues.length === 0) {
      toast.success("Form values up to date");
      return;
    }

    const formattedValues = editedValues
      // File and FileList should not be submitted
      .filter(({ master_schema_field_id }) => {
        const { type } = Object.values(applicationData.schema.fields).find(
          ({ masterSchemaFieldId }) => Number(masterSchemaFieldId) === Number(master_schema_field_id)
        );
        return ![FieldTypes.File, FieldTypes.FileList].includes(type);
      })
      .reduce((acc, field) => {
        acc[field.master_schema_field_id] = field.value;
        return acc;
      }, {});

    updateUserApplicationValues.mutate({ values: formattedValues });
  };

  const handleUpdateUserApplicationStatus = (newStatus) => {
    updateUserApplicationStatus.mutate({ status: newStatus.value });
  };

  const handleApplicationReFetch = () => {
    userApplication.refetch();
  };

  if (
    (selectedApplicationId && (userApplication.isFetching || userApplicationValues.isFetching)) ||
    (!applicationData && userApplication.isFetching)
  ) {
    return <div>Loading...</div>;
  }

  return (
    <div className="onboarding-create-feature mb-4 pb-4">
      <div className="onboarding-create-feature_header">
        {isCreate ? (
          <div className="onboarding-create-feature_header_title">Onboarding Create</div>
        ) : (
          <>
            <div className="onboarding-create-feature_header_title">Application</div>
            <div className="onboarding-create-feature_header_name">{applicationData.name || ""}</div>
          </>
        )}
      </div>
      <Card>
        <UserOnboardingForm isCreate={isCreate} />
        {!isCreate && (
          <>
            <UserOnboardingDForm
              onFieldChange={handleFieldChange}
              isRefetching={userApplication.isFetching}
              onRefetch={handleApplicationReFetch}
              dFormId={applicationData.id}
              formData={applicationData.schema}
              accessType={applicationData.access_type}
              isManualSave={true}
              formValues={applicationValues}
            />
            <div className="col-md-12 d-flex justify-content-between align-items-center mb-2">
              <div style={{ width: "160px" }}>
                <Select
                  className=""
                  classNamePrefix="select"
                  value={{ value: applicationData.status, label: applicationData.status }}
                  options={STATUSES}
                  isLoading={updateUserApplicationStatus.isLoading}
                  onChange={handleUpdateUserApplicationStatus}
                />
              </div>
              <div>
                <Button
                  color="primary"
                  onClick={handleUserApplicationValuesUpdate}
                  className="ml-auto submit-onboarding-button"
                >
                  Save
                </Button>
              </div>
            </div>
          </>
        )}
      </Card>
    </div>
  );
};

export default UserEditApplication;
