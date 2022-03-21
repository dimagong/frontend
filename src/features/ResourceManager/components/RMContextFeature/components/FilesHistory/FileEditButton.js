import React from "react";
import PropTypes from "prop-types";

import NmpButton from "components/nmp/NmpButton";

import EditIcon from "assets/img/icons/edit.png";

import { useEditRMFile } from "../../../../resourceManagerQueries";

const FileEditButton = ({ fileId, onEditSuccess }) => {
  const editFile = useEditRMFile({ fileId }, { onSuccess: onEditSuccess });

  const onEdit = () => editFile.mutate();

  return (
    <NmpButton
      className="mr-1"
      size="sm"
      textColor="#95989a"
      backgroundColor="transparent"
      icon={<img src={EditIcon} alt="Edit" />}
      onClick={onEdit}
      loading={editFile.isLoading}
    />
  );
};

FileEditButton.propTypes = {
  fileId: PropTypes.number.isRequired,
  onEditSuccess: PropTypes.func.isRequired,
};

export default FileEditButton;
