import React, { useState } from "react";
import {
  useUserApplication,
  useUserApplicationStatusMutation,
  useUserApplicationValues,
  useUserApplicationValuesMutation,
} from "../../userQueries";
import UserOnboardingDForm from "../../../userOnboarding/UserOnboardingDForm";
import UserOnboardingForm from "../../../userOnboarding/UserOnboardingForm";
import { Button, Card } from "reactstrap";
import Select from "react-select";
import { toast } from "react-toastify";
import {
  FIELD_VALUE_PREPARE,
  CONDITIONS_COMPARE_FUNCTIONS,
  EFFECT_ELEMENT_PROP,
} from "../../../../Applications/Components/DFormElementEdit/Components/ConditionalElementRender/constants";
import { cloneDeep } from "lodash";

const STATUSES = [
  { value: "submitted", label: "submitted" },
  { value: "approved", label: "approved" },
  { value: "rejected", label: "rejected" },
  { value: "unsubmitted", label: "unsubmitted" },
];

const UserEditApplication = ({ isCreate, selectedApplicationId }) => {
  const [applicationData, setApplicationData] = useState(isCreate ? {} : null);
  const [applicationValues, setApplicationValues] = useState({});

  const applyConditionalRender = (schema) => {
    const schemaCopy = cloneDeep(schema);

    for (const fieldId in schemaCopy.fields) {
      if (schemaCopy.fields.hasOwnProperty(fieldId)) {
        const field = schemaCopy.fields[fieldId];

        //TODO handle more conditions in future, currently has only one;
        const condition = field.conditions && field.conditions[0];

        //TODO this should be handled in render, so form shouldn't be rendered until we get applicationValues from API
        // remove here !Object.values(applicationValues.length) after fix
        if (!condition || !Object.values(applicationValues).length) continue;

        // Get a value from values by control field MS prop ID. Then take a prepare function depending on control field type
        // and pass control field value into prepare function;
        const controlValue = FIELD_VALUE_PREPARE[condition.field.type](
          applicationValues[condition.field.masterSchemaPropertyId].value
        );

        const isConditionApplicable = CONDITIONS_COMPARE_FUNCTIONS[condition.condition.conditionType](
          condition.expectedValue,
          controlValue
        );

        const applicableEffect = EFFECT_ELEMENT_PROP[condition.effect];

        schemaCopy.fields[fieldId][applicableEffect.propName] = isConditionApplicable
          ? applicableEffect.value
          : !applicableEffect.value;
      }
    }

    return schemaCopy;
  };

  const userApplication = useUserApplication(
    { userApplicationId: selectedApplicationId },
    {
      onSuccess: (data) => {
        setApplicationData(data);
      },
      enabled: !isCreate,
      refetchOnWindowFocus: false,
    }
  );

  const updateUserApplicationStatus = useUserApplicationStatusMutation(
    { userApplicationId: selectedApplicationId },
    {
      onSuccess: (data) => {
        toast.success("Status successfully changed");
      },
    }
  );

  useUserApplicationValues(
    { userApplicationId: selectedApplicationId },
    {
      onSuccess: (data) => {
        setApplicationValues(typeof data === "object" ? data : {}); // When there are no values it returns empty array
      },
      enabled: !isCreate,
      refetchOnWindowFocus: false,
    }
  );

  const updateUserApplicationValues = useUserApplicationValuesMutation(
    { userApplicationId: selectedApplicationId },
    {
      onSuccess: (data) => {
        toast.success("Saved");
      },
    }
  );

  const handleFieldValueChange = (msPropId, value) => {
    // Mark field as edited for further extraction and save on submit.
    // Currently we don't care about case when field value return to initial state and much actual
    // field value from back-end.
    // (For example we enter hello in empty field and delete it. Field still counts as edited)

    const newFieldValue = { ...(applicationValues[msPropId] || {}), value, edited: true };

    setApplicationValues({ ...applicationValues, [msPropId]: newFieldValue });
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

  if ((selectedApplicationId && userApplication.isLoading) || (!applicationData && userApplication.isRefetching)) {
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
              onFieldValueChange={handleFieldValueChange}
              isRefetching={userApplication.isRefetching}
              onRefetch={handleApplicationReFetch}
              formData={applyConditionalRender(applicationData.schema)}
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
