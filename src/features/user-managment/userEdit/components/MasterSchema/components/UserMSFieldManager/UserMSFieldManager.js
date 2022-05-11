import React from "react";
import { Spinner } from "reactstrap";
import { toast } from "react-toastify";
import { useQueryClient } from "react-query";

import { IdType } from "utility/prop-types";

import { useUserMSResource, useAttachResourceFileToMS } from "api/User/useUserMSResources";
import { MasterSchemaHierarchyQueryKeys } from "api/masterSchema/hierarchy/masterSchemaHierarchyQueries";
import { MasterSchemaFieldValueQueryKeys } from "api/masterSchema/fieldValue/masterSchemaFieldValueQueries";

import UserMSFieldManagerForm from "./UserMSFieldManagerForm";

const UserMSFieldManager = ({ userId, msFieldId }) => {
  const queryClient = useQueryClient();

  const attachRMFile = useAttachResourceFileToMS(
    { msFieldId, userId },
    {
      onSuccess: () => {
        queryClient.invalidateQueries(MasterSchemaFieldValueQueryKeys.all());
        queryClient.invalidateQueries(MasterSchemaHierarchyQueryKeys.getByUser(userId));

        toast.success("The resource file was successfully saved.");
      },
    }
  );

  const { data: MSUserResource, isLoading } = useUserMSResource({ msFieldId, userId });

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
      rmFieldId={MSUserResource?.resource_manager_field_id}
      rmFieldFileId={MSUserResource?.resource_manager_field_file_id}
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
