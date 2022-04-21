import "./styles.scss";

import React from "react";
import PropTypes from "prop-types";

import MFAccessManagerData from "./MFAccessManagerData";
import MFAccessManagerModal from "./MFAccessManagerModal";

const MFAccessManager = ({ memberFirmId }) => {
  return (
    <MFAccessManagerModal>
      <MFAccessManagerData memberFirmId={memberFirmId} />
    </MFAccessManagerModal>
  );
};

MFAccessManager.propTypes = {
  memberFirmId: PropTypes.number.isRequired,
};

export default MFAccessManager;
