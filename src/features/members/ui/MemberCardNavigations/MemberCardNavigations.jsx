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
              style={{ backgroundColor: "white", color: "black", marginRight: "30px" }}
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
            <NpmButton
              onClick={() => handleClose()}
              style={{ backgroundColor: "#F3F3F3", color: "black", borderColor: "#D2D2D2" }}
            >
              <span>Close</span>
            </NpmButton>
          </div>

          {!!currentIndex && (
            <NpmButton
              onClick={() => handleSwitchToPreviousQuestion()}
              style={{ backgroundColor: "white", color: "black", marginRight: "30px", borderColor: "#35A046" }}
            >
              <i className="arrow left"></i>
              <span>Back</span>
            </NpmButton>
          )}
          <NpmButton
            onClick={() => handleAnswerSubmit()}
            style={{ backgroundColor: "#35A046", borderColor: "#35A046" }}
          >
            <span>{currentIndex === count - 1 ? "Finish" : "Next"}</span>
            <i className="arrow right"></i>
          </NpmButton>
        </div>
      )}
    </div>
  );
};

export default MemberCardNavigations;
