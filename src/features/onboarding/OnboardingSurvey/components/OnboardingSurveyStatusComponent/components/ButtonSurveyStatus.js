import React from "react";

import { Button } from "reactstrap";

const ButtonSurveyStatus = ({ onForceApplicationShow, children }) => {
  return (
    <Button
      className={"status_description_action_show-button"}
      onClick={() => onForceApplicationShow(true)}
      color="primary"
    >
      {children}
    </Button>
  );
};

export default ButtonSurveyStatus;
