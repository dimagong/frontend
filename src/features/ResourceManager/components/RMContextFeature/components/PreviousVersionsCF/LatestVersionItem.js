import React from "react";
import PropTypes from "prop-types";
import { toast } from "react-toastify";
import { useMutation, useQueryClient } from "react-query";

import { useBoolean } from "hooks/use-boolean";
import NmpButton from "components/nmp/NmpButton";

import { resourceManagerService } from "api/resourceManager";

import EditIcon from "assets/img/icons/edit.png";
import DeleteIcon from "assets/img/icons/x.png";

import VersionItem from "./VersionItem";
import VersionDownloadButton from "./VersionDownloadButton";

const LatestVersionItem = ({ field, version, expandable, ...attrs }) => {
  const queryClient = useQueryClient();

  const [editing, editingStart, editingStop] = useBoolean(false);

  const editResource = useMutation((versionId) => resourceManagerService.editVersion({ versionId }), {
    onSuccess: () => {
      editingStart();
      queryClient.invalidateQueries(["resource-manager-field-versions", field.id]);
    },
  });

  const finishResource = useMutation((versionId) => resourceManagerService.finishEditVersion({ versionId }), {
    onSuccess: () => {
      editingStop();
      toast.success("File was successfully edited");
      queryClient.invalidateQueries(["resource-manager-field-versions", field.id]);
      expandable.clear();
    },
  });

  const removeResource = useMutation((versionId) => resourceManagerService.removeResource({ versionId }), {
    onSuccess: () => {
      toast.success("File was successfully removed");
      queryClient.invalidateQueries(["resource-manager-field-versions", field.id]);
      expandable.clear();
    },
  });

  const onEdit = () => {
    editResource.mutate(version.id);
  };

  const onRemove = () => removeResource.mutate(version.id);

  const onFinish = () => finishResource.mutate(version.id);

  return (
    <VersionItem
      version={version}
      expandable={expandable}
      controls={
        editing ? (
          <NmpButton onClick={onFinish} size="sm" color="primary" loading={finishResource.isLoading}>
            Finish editing
          </NmpButton>
        ) : (
          <>
            <VersionDownloadButton versionId={version.id} name={version.name} />
            <NmpButton
              className="mr-1"
              size="sm"
              textColor="#95989a"
              backgroundColor="transparent"
              icon={<img src={EditIcon} alt="Edit" />}
              onClick={onEdit}
              loading={editResource.isLoading}
            />
            <NmpButton
              className="mr-1"
              size="sm"
              textColor="#95989a"
              backgroundColor="transparent"
              icon={<img src={DeleteIcon} alt="Delete" />}
              onClick={onRemove}
              loading={removeResource.isLoading}
            />
          </>
        )
      }
      {...attrs}
    />
  );
};

LatestVersionItem.propTypes = {
  field: PropTypes.object.isRequired,
  version: PropTypes.object.isRequired,
  expandable: PropTypes.object.isRequired,
};

export default LatestVersionItem;
