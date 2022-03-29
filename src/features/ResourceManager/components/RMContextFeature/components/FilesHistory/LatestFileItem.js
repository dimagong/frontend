import React from "react";
import PropTypes from "prop-types";
import { toast } from "react-toastify";

import { IdType } from "utility/prop-types";
import { useBoolean } from "hooks/use-boolean";

import {
  useDeleteRMFile,
  useDownloadRMFile,
  useEditRMFile,
  useFinishRMFile,
} from "api/resourceManager/useRMFieldFiles";

import FileItem from "./FileItem";
import RMFileControls from "./RMFileControls";

const LatestFileItem = ({ fieldId, file, expandable, ...attrs }) => {
  const [isEditing, editingStart, editingStop] = useBoolean(file.google_drive_doc !== null);

  const onEditSuccess = () => {
    editingStart();
    expandable.clear();
  };

  const onDeleteSuccess = () => {
    expandable.clear();
    toast.success("File was successfully removed");
  };

  const onFinishEditingSuccess = () => {
    editingStop();
    expandable.clear();
    toast.success("File was successfully edited");
  };

  const fileId = file.id;
  const downloadRMFIle = useDownloadRMFile({ fileId, filename: file.name });
  const editRMFile = useEditRMFile({ fileId }, { onSuccess: onEditSuccess });
  const deleteRMFile = useDeleteRMFile({ fileId, fieldId }, { onSuccess: onDeleteSuccess });
  const finishRMFile = useFinishRMFile({ fileId, fieldId }, { onSuccess: onFinishEditingSuccess });

  return (
    <FileItem
      file={file}
      expandable={expandable}
      controls={
        <RMFileControls
          isEditing={isEditing}
          onDownload={downloadRMFIle.mutate}
          downloadIsLoading={downloadRMFIle.isLoading}
          onEdit={editRMFile.mutate}
          editIsLoading={editRMFile.isLoading}
          onDelete={deleteRMFile.mutate}
          deleteIsLoading={deleteRMFile.isLoading}
          onFinishEditing={finishRMFile.mutate}
          finishEditingIsLoading={finishRMFile.isLoading}
        />
      }
      {...attrs}
    />
  );
};

LatestFileItem.propTypes = {
  fieldId: IdType.isRequired,
  file: PropTypes.object.isRequired,
  expandable: PropTypes.object.isRequired,
};

export default LatestFileItem;
