import React from "react";
import { PropTypes } from "prop-types";
import { ExternalLink } from "react-feather";

import { useBoolean } from "hooks/use-boolean";
import { stopPropagation } from "utility/event-decorators";

import SurveyModal from "features/Surveys/Components/SurveyModal";

const TEMP_LONG_VALUE_LENGTH = 15;

const isLong = (value) => value > TEMP_LONG_VALUE_LENGTH;

const extendedButtonStyle = {
  padding: 0,
  fontSize: "inherit",
  fontWeight: "inherit",
  color: "currentColor",
  backgroundColor: "transparent",
};

const ValuePreview = ({ value, length }) => {
  const [extendedModal, openExtendedModal, closeExtendedModal] = useBoolean(false);

  if (!value) {
    return "Null";
  }

  return isLong(length) ? (
    <button className="btn d-flex align-items-center" style={extendedButtonStyle} onClick={stopPropagation(openExtendedModal)}>
      <div>This is a long text</div>
      <ExternalLink style={{ marginLeft: "5px" }} size="12" />

      <SurveyModal isOpen={extendedModal} title="Extended input" onClose={closeExtendedModal} actions={false}>
        <div className="py-2">{value}</div>
      </SurveyModal>
    </button>
  ) : (
    <div>{value}</div>
  );
};

ValuePreview.propTypes = {
  value: PropTypes.any.isRequired,
  length: PropTypes.number.isRequired,
};

export default ValuePreview;
