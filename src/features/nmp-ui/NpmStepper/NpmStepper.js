import "./styles.scss";

import React from "react";

import PropTypes from "prop-types";

const NpmStepper = (props) => {
  const { totalSteps, currentStrep } = props;
  const widthStep = 100 / totalSteps;
  const disableElement = (
    <div
      className="stepper"
      style={{ width: `calc(${widthStep}% - 7px)`, backgroundColor: "#E7E7E7", borderColor: "#E7E7E7" }}
    />
  );
  const ableElement = (
    <div
      className="stepper"
      style={{ width: `calc(${widthStep}% - 7px)`, backgroundColor: "#35A046", borderColor: "#35A046" }}
    />
  );

  const stepperList = [];
  let n = 0;
  while (n < totalSteps) {
    if (n < currentStrep) {
      stepperList.push(ableElement);
    } else {
      stepperList.push(disableElement);
    }

    n++;
  }
  return <div className="steppers">{stepperList.map((el) => el)}</div>;
};

NpmStepper.defaultProps = {
  totalSteps: 2,
  currentStrep: 0,
};

NpmStepper.propTypes = {
  totalSteps: PropTypes.number,
  currentStrep: PropTypes.number,
};

export default NpmStepper;
