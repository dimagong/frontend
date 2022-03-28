import React from "react";
import PropTypes from "prop-types";

import NmpButton from "components/nmp/NmpButton";

import { useFinishRMFile } from "api/resourceManager/useRMFieldFiles";

const FileFinishButton = ({ fileId, fieldId, onFinishSuccess }) => {
  const finishFile = useFinishRMFile({ fileId, fieldId }, { onSuccess: onFinishSuccess });

  const onFinish = () => finishFile.mutate();

  return (
    <NmpButton onClick={onFinish} size="sm" color="primary" loading={finishFile.isLoading}>
      Finish editing
    </NmpButton>
  );
};

FileFinishButton.propTypes = {
  fileId: PropTypes.number.isRequired,
  fieldId: PropTypes.number.isRequired,
  onFinishSuccess: PropTypes.func.isRequired,
};

export default FileFinishButton;
