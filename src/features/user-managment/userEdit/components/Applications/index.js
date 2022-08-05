import React, { useState } from "react";
import { useUserApplication, useUserApplicationStatusMutation, useUserApplicationValues } from "../../userQueries";
import UserOnboardingDForm from "../../../userOnboarding/UserOnboardingDForm";
import UserOnboardingForm from "../../../userOnboarding/UserOnboardingForm";
import { Button, Card } from "reactstrap";
import Select from "react-select";
import { toast } from "react-toastify";

const STATUSES = [
  { value: "submitted", label: "submitted" },
  { value: "approved", label: "approved" },
  { value: "rejected", label: "rejected" },
  { value: "unsubmitted", label: "unsubmitted" },
];

const UserEditApplication = ({ isCreate, selectedApplicationId }) => {
  const [applicationData, setApplicationData] = useState(isCreate ? {} : null);
  const [applicationValues, setApplicationValues] = useState({});

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
        setApplicationData({ ...applicationData, status: data });
        toast.success("Status successfully changed");
      },
    }
  );

  const userApplicationValues = useUserApplicationValues(
    { userApplicationId: selectedApplicationId },
    {
      onSuccess: (data) => {
        console.log("test values", data);
        setApplicationValues(typeof data === "object" ? data : {}); // When there are no values it returns empty array
      },
      enabled: !isCreate,
      refetchOnWindowFocus: false,
    }
  );

  const handleUpdateUserApplicationStatus = (newStatus) => {
    updateUserApplicationStatus.mutate({ status: newStatus.value });
  };

  console.log("test", userApplication);

  const handleApplicationReFetch = () => {
    userApplication.refetch();
  };

  if (
    (selectedApplicationId && userApplication.status === "loading") ||
    (!applicationData && userApplication.isRefetching)
  ) {
    return <div>Loading...</div>;
  }

  return (
    <div className="onboarding-create-feature">
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
              isRefetching={userApplication.isRefetching}
              onRefetch={handleApplicationReFetch}
              formData={applicationData.schema}
              isManualSave={true}
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
                <Button type="submit" className="ml-auto submit-onboarding-button">
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
