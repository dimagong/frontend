import React from "react";
import PropTypes from "prop-types";

import NmpButton from "components/nmp/NmpButton";

import DeleteIcon from "assets/img/icons/x.png";
import EditIcon from "assets/img/icons/edit.png";

import FileDownloadButton from "./FileDownloadButton";

const RMFileControls = (props) => {
  const {
    isEditing,

    onDownload,
    downloadIsLoading,

    onEdit,
    editIsLoading,

    onDelete,
    deleteIsLoading,

    onFinishEditing,
    finishEditingIsLoading,
  } = props;

  return (
    <>
      <FileDownloadButton onDownload={onDownload} isLoading={downloadIsLoading} />

      <NmpButton
        className="mr-1"
        size="sm"
        textColor="#95989a"
        backgroundColor="transparent"
        icon={<img src={EditIcon} alt="Edit" />}
        onClick={onEdit}
        loading={editIsLoading}
      />

      <NmpButton
        className="mr-1"
        size="sm"
        textColor="#95989a"
        backgroundColor="transparent"
        icon={<img src={DeleteIcon} alt="Delete" />}
        onClick={onDelete}
        loading={deleteIsLoading}
      />

      {isEditing ? (
        <NmpButton onClick={onFinishEditing} size="sm" color="primary" loading={finishEditingIsLoading}>
          Finish editing
        </NmpButton>
      ) : null}
    </>
  );
};

RMFileControls.propTypes = {
  onDownload: PropTypes.func.isRequired,
  onEdit: PropTypes.func.isRequired,
  onDelete: PropTypes.func.isRequired,
  onFinishEditing: PropTypes.func.isRequired,

  downloadIsLoading: PropTypes.bool.isRequired,
  editIsLoading: PropTypes.bool.isRequired,
  deleteIsLoading: PropTypes.bool.isRequired,
  finishEditingIsLoading: PropTypes.bool.isRequired,
};

export default RMFileControls;
