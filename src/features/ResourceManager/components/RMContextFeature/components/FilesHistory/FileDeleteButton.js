import React from "react";
import PropTypes from "prop-types";

import NmpButton from "components/nmp/NmpButton";

import DeleteIcon from "assets/img/icons/x.png";

import { useDeleteRMFile } from "api/resourceManager/useRMFieldFiles";

const FileDeleteButton = ({ fileId, fieldId, onDeleteSuccess }) => {
  const deleteFile = useDeleteRMFile({ fileId, fieldId }, { onSuccess: onDeleteSuccess });

  const onDelete = () => deleteFile.mutate();

  return (
    <NmpButton
      className="mr-1"
      size="sm"
      textColor="#95989a"
      backgroundColor="transparent"
      icon={<img src={DeleteIcon} alt="Delete" />}
      onClick={onDelete}
      loading={deleteFile.isLoading}
    />
  );
};

FileDeleteButton.propTypes = {
  fileId: PropTypes.number.isRequired,
  fieldId: PropTypes.number.isRequired,
  onDeleteSuccess: PropTypes.func.isRequired,
};

export default FileDeleteButton;
