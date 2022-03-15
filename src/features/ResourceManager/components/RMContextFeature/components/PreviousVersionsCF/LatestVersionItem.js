import React from "react";
import PropTypes from "prop-types";
import { toast } from "react-toastify";
import { useDispatch } from "react-redux";

import { useBoolean } from "hooks/use-boolean";

import NmpButton from "components/nmp/NmpButton";

import appSlice from "app/slices/appSlice";

import { ResourceManagerPreviousVersionService } from "api/resourceManager/resourceManagerPreviousVersionService";

import EditIcon from "assets/img/icons/edit.png";
import DeleteIcon from "assets/img/icons/x.png";

import VersionItem from "./VersionItem";
import VersionDownloadButton from "./VersionDownloadButton";

const { getResourcePreviousVersionsRequest, removeResourceTemplateRequest } = appSlice.actions;

const LatestVersionItem = ({ version, expandable, selectableNodes, ...attrs }) => {
  const dispatch = useDispatch();

  const [editing, editingStart, editingStop] = useBoolean(false);
  const [finishing, finishingStart, finishingStop] = useBoolean(false);
  const [tryingToEdit, tryingToEditStart, tryingToEditStop] = useBoolean(false);

  const onFinish = () => {
    finishingStart();
    ResourceManagerPreviousVersionService.finishEditVersion({ versionId: version.id })
      .then((response) => {
        dispatch(getResourcePreviousVersionsRequest(selectableNodes.selected.node.id));
        toast.success("File was successfully edited");
        expandable.clear();
      })
      .finally(() => {
        editingStop();
        finishingStop();
      });
  };

  const tryToEdit = () => {
    tryingToEditStart();
    ResourceManagerPreviousVersionService.editVersion({ versionId: version.id })
      .then(editingStart)
      .finally(tryingToEditStop);
  };

  const onRemove = () => {
    dispatch(
      removeResourceTemplateRequest({ fileId: version.id, resourceManagerFieldId: selectableNodes.selected.node.id })
    );
  };

  return (
    <VersionItem
      version={version}
      expandable={expandable}
      controls={
        editing ? (
          <NmpButton onClick={onFinish} size="sm" color="primary" loading={finishing}>
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
              onClick={tryToEdit}
              loading={tryingToEdit}
            />
            <NmpButton
              className="mr-1"
              size="sm"
              textColor="#95989a"
              backgroundColor="transparent"
              icon={<img src={DeleteIcon} alt="Delete" />}
              onClick={onRemove}
            />
          </>
        )
      }
      {...attrs}
    />
  );
};

LatestVersionItem.propTypes = {
  version: PropTypes.object.isRequired,
  expandable: PropTypes.object.isRequired,
  selectableNodes: PropTypes.object.isRequired,
};

export default LatestVersionItem;
