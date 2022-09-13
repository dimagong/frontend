import "./styles.scss";

import React from "react";

import { statusConstants } from "../../data/constants/statusConstants";
import NpmButton from "../../../nmp-ui/NpmButton";

const MemberCardNavigations = ({
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
              onClick={() => handleSwitchToPreviousQuestion()}
              style={{ marginRight: "30px" }}
              buttonType="transparent"
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
            <NpmButton onClick={() => handleClose()} buttonType="default">
              <span>Close</span>
            </NpmButton>
          </div>

          {!!currentIndex && (
            <NpmButton
              buttonType="transparent"
              onClick={() => handleSwitchToPreviousQuestion()}
              style={{ marginRight: "30px" }}
            >
              <i className="arrow left"></i>
              <span>Back</span>
            </NpmButton>
          )}
          <NpmButton onClick={() => handleAnswerSubmit()} buttonType="base">
            <span>{currentIndex === count - 1 ? "Finish" : "Next"}</span>
            <i className="arrow right"></i>
          </NpmButton>
        </div>
      )}
    </div>
  );
};

export default MemberCardNavigations;
