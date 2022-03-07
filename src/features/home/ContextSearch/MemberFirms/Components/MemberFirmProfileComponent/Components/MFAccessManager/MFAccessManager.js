import "./styles.scss";

import React from "react";
import PropTypes from "prop-types";
import { useSelector } from "react-redux";

import { selectProfile } from "app/selectors";

import MFAccessManagerData from "./MFAccessManagerData";
import MFAccessManagerModal from "./MFAccessManagerModal";

const MFAccessManager = ({ memberFirmId }) => {
  const profile = useSelector(selectProfile);

  return (
    <MFAccessManagerModal>
      <MFAccessManagerData userId={profile.id} memberFirmId={memberFirmId} />
    </MFAccessManagerModal>
  );
};

MFAccessManager.propTypes = {
  memberFirmId: PropTypes.number.isRequired,
};

export default MFAccessManager;
