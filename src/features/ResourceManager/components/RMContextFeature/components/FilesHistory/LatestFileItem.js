import React from "react";
import PropTypes from "prop-types";
import { toast } from "react-toastify";

import { IdType } from "utility/prop-types";
import { useBoolean } from "hooks/use-boolean";

import FileItem from "./FileItem";
import FileEditButton from "./FileEditButton";
import FileDeleteButton from "./FileDeleteButton";
import FileFinishButton from "./FileFinishButton";
import FileDownloadButton from "./FileDownloadButton";

const LatestFileItem = ({ fieldId, file, expandable, ...attrs }) => {
  const [editing, editingStart, editingStop] = useBoolean(false);

  const onEditSuccess = () => editingStart();

  const onDeleteSuccess = () => {
    expandable.clear();
    toast.success("File was successfully removed");
  };

  const onFinishSuccess = () => {
    editingStop();
    toast.success("File was successfully edited");
    expandable.clear();
  };

  return (
    <FileItem
      file={file}
      expandable={expandable}
      controls={
        editing ? (
          <>
            <FileDownloadButton name={file.name} fileId={file.id} />
            <FileEditButton fileId={file.id} onEditSuccess={onEditSuccess} />
            <FileDeleteButton fileId={file.id} fieldId={fieldId} onDeleteSuccess={onDeleteSuccess} />
            <FileFinishButton fileId={file.id} fieldId={fieldId} onFinishSuccess={onFinishSuccess} />
          </>
        ) : (
          <>
            <FileDownloadButton name={file.name} fileId={file.id} />
            <FileEditButton fileId={file.id} onEditSuccess={onEditSuccess} />
            <FileDeleteButton fileId={file.id} fieldId={fieldId} onDeleteSuccess={onDeleteSuccess} />
          </>
        )
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
