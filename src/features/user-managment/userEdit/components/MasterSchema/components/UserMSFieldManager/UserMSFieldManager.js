import React from "react";
import { toast } from "react-toastify"
import { Spinner } from "reactstrap";

import { IdType } from "utility/prop-types";

import UserMSFieldManagerForm from "./UserMSFieldManagerForm";
import { useMSUserResource, useAttachRMFileToMS } from "./userMSFieldQueries";

const UserMSFieldManager = ({ userId, msFieldId }) => {
  const attachRMFile = useAttachRMFileToMS({ msFieldId, userId }, {
    onSuccess: () => toast.success("The resource file was successfully attached."),
  });

  const { data: MSUserResource, isLoading } = useMSUserResource({ msFieldId, userId });

  const onSubmit = (submitted) => {
    if (submitted.invalid) return;

    const rmFieldFileId = submitted.values.file.value.id;

    attachRMFile.mutate({ rmFieldFileId });
  };

  if (isLoading) {
    return (
      <div className="d-flex justify-content-center">
        <Spinner />
      </div>
    );
  }

  return (
    <UserMSFieldManagerForm
      userId={userId}
      rmFieldId={MSUserResource.resource_manager_field_id}
      rmFieldFileId={MSUserResource.resource_manager_field_file_id}
      submitting={attachRMFile.isLoading}
      onSubmit={onSubmit}
    />
  );
};

UserMSFieldManager.propTypes = {
  userId: IdType.isRequired,
  msFieldId: IdType.isRequired,
};

export default UserMSFieldManager;
