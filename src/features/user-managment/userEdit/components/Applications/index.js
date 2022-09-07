import Select from "react-select";
import { cloneDeep } from "lodash";
import { toast } from "react-toastify";
import { Button, Card } from "reactstrap";
import React, { useEffect, useState } from "react";

import {
  useUserApplication,
  useUserApplicationStatusMutation,
  useUserApplicationValues,
  useUserApplicationValuesMutation,
} from "../../userQueries";

import UserOnboardingDForm from "../../../userOnboarding/UserOnboardingDForm";
import UserOnboardingForm from "../../../userOnboarding/UserOnboardingForm";

import {
  DCREffectProps,
  DCRFieldValueConvertors,
  DCROperatorTypesComparotors,
} from "features/Applications/Components/DFormElementEdit/Components/ConditionalElementRender/constants";

const STATUSES = [
  { value: "submitted", label: "submitted" },
  { value: "approved", label: "approved" },
  { value: "rejected", label: "rejected" },
  { value: "unsubmitted", label: "unsubmitted" },
];

const checkConditions = (elements, values, fields) => {
  for (const elementId in elements) {
    if (!Object.hasOwnProperty.call(elements, elementId)) continue;
    const element = elements[elementId];
    const conditions = element.conditions;

    for (const condition of conditions) {
      const { operatorType, effectType, fieldId, expectedValue } = condition;

      const field = fields[fieldId];
      const value = values[field.masterSchemaFieldId];
      const preparedValue = DCRFieldValueConvertors[field.type](value);
      const operatorComparator = DCROperatorTypesComparotors[operatorType];
      const isApplicable = operatorComparator(expectedValue, preparedValue);

      if (isApplicable) {
        const propName = DCREffectProps[effectType];
        elements[elementId][propName] = isApplicable;
      }
    }
  }

  return elements;
};

const applyConditionalRender = (schema, values) => {
  if (!schema) return null;
  // Do not apply conditions on empty values
  if (Object.keys(values).length === 0) return schema;

  const schemaCopy = cloneDeep(schema);

  const { fields, sections, groups } = schemaCopy;

  schemaCopy.fields = checkConditions(fields, values, fields);
  schemaCopy.groups = checkConditions(groups, values, fields);
  schemaCopy.sections = checkConditions(sections, values, fields);

  return schemaCopy;
};

const UserEditApplication = ({ isCreate, selectedApplicationId }) => {
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
      // When there are no values it returns empty array
      onSuccess: (data) => setApplicationValues(typeof data === "object" ? data : {}),
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

  const applicationSchema = applyConditionalRender(applicationData?.schema, applicationValues);

  useEffect(() => {
    setApplicationData(isCreate ? {} : null);
    setApplicationValues({});
  }, [isCreate, selectedApplicationId]);

  const handleFieldChange = (field, value) => {
    // Mark field as edited for further extraction and save on submit.
    // Currently, we don't care about case when field value return to initial state and much actual
    // field value from back-end.
    // (For example we enter hello in empty field and delete it. Field still counts as edited)

    const newFieldValue = { ...(applicationValues[field.masterSchemaFieldId] || {}), value, edited: true };
    setApplicationValues({ ...applicationValues, [field.masterSchemaFieldId]: newFieldValue });
  };

  const handleUserApplicationValuesUpdate = () => {
    const newValues = Object.values(applicationValues).filter((field) => field.edited);

    if (!newValues.length) {
      toast.success("Form values up to date");
      return;
    }

    const formattedValues = newValues.reduce((acc, field) => {
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
              formData={applicationSchema}
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
                <Button onClick={handleUserApplicationValuesUpdate} className="ml-auto submit-onboarding-button">
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
