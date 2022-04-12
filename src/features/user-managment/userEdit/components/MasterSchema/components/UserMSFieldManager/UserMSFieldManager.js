import React from "react";
import { Spinner } from "reactstrap";
import { toast } from "react-toastify";

import { IdType } from "utility/prop-types";

import { useUserMSResource, useAttachResourceFileToMS } from "api/User/useUserMSResources";

import UserMSFieldManagerForm from "./UserMSFieldManagerForm";
import {useSelector} from "react-redux";
import {
  selectIsUserMasterSchemaHierarchySearchParamsInitial,
  selectUserMasterSchemaHierarchySearchParams
} from "app/selectors/userSelectors";
import {queryClient} from "../../../../../../../api/queryClient";
import {MSHierarchySearchKey} from "../../hooks/useMSHierarchySearch";

const UserMSFieldManager = ({ userId, msFieldId }) => {
  const searchParams = useSelector(selectUserMasterSchemaHierarchySearchParams);
  const isSearchParamsInitial = useSelector(selectIsUserMasterSchemaHierarchySearchParamsInitial);

  // ToDo: rename it to save
  const attachRMFile = useAttachResourceFileToMS(
    { msFieldId, userId },
    {
      onSuccess: () => {
        toast.success("The resource file was successfully saved.");
        // Fixme: Critical!!! Hack to update versions when hierarchy is updating
        queryClient.invalidateQueries([MSHierarchySearchKey, {
          userId, ...searchParams,
          show_empty_folders: isSearchParamsInitial
        }]);

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
