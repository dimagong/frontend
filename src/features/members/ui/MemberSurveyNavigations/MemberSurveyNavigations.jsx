import "./styles.scss";

import React from "react";

import { statusConstants } from "../../data/constants/statusConstants";
import NpmButton from "../../../nmp-ui/NpmButton";

const MemberSurveyNavigations = ({
  surveyStatus,
  handleSurveyStart,
  handleSwitchToPreviousQuestion,
  handleAnswerSubmit,
  handleClose,
  currentIndex,
  count,
}) => {
  return (
    <div className="membercard-navigations">
      {surveyStatus === statusConstants.NOT_STARTED && (
        <div>
          <NpmButton onClick={() => handleSurveyStart()}>
            <span>Begin</span>
            <i className="arrow right"></i>
          </NpmButton>
        </div>
      )}
      {surveyStatus === statusConstants.STARTED && (
        <div>
          {!!currentIndex && (
            <NpmButton
              type="transparent"
              onClick={() => handleSwitchToPreviousQuestion()}
              style={{ marginRight: "30px" }}
            >
              <i className="arrow left"></i>
              <span>Back</span>
            </NpmButton>
          )}
          <NpmButton onClick={() => handleAnswerSubmit()}>
            <span>{currentIndex === count - 1 ? "Finish" : "Next"}</span>
            <i className="arrow right"></i>
          </NpmButton>
        </div>
      )}
      {surveyStatus === statusConstants.APPROVED && (
        <div className="approved-navigation">
          <div className="close-button">
            <NpmButton type="default" onClick={() => handleClose()}>
              <span>Close</span>
            </NpmButton>
          </div>

          {!!currentIndex && (
            <NpmButton
              type="transparent"
              onClick={() => handleSwitchToPreviousQuestion()}
              style={{ marginRight: "30px" }}
            >
              <i className="arrow left"></i>
              <span>Back</span>
            </NpmButton>
          )}
          <NpmButton type="base" onClick={() => handleAnswerSubmit()}>
            <span>{currentIndex === count - 1 ? "Finish" : "Next"}</span>
            <i className="arrow right"></i>
          </NpmButton>
        </div>
      )}
    </div>
  );
};

export default MemberSurveyNavigations;
