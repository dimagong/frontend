import "./styles.scss";

import React from "react";
import { RightOutlined, LeftOutlined } from "@ant-design/icons";

import { NmpButton } from "features/nmp-ui";

import { statusConstants } from "../../data/constants/statusConstants";

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
        <NmpButton
          type="nmp-primary"
          icon={<RightOutlined />}
          iconRight
          onClick={handleSurveyStart}
          className="membercard-navigations__btn"
        >
          Begin
        </NmpButton>
      )}
      {surveyStatus === statusConstants.STARTED && (
        <>
          {!!currentIndex && (
            <NmpButton
              type="nmp-ghost"
              icon={<LeftOutlined />}
              onClick={handleSwitchToPreviousQuestion}
              className="membercard-navigations__btn"
            >
              Back
            </NmpButton>
          )}

          <NmpButton
            type="nmp-primary"
            icon={currentIndex === count - 1 ? null : <RightOutlined />}
            iconRight
            onClick={handleAnswerSubmit}
            className="membercard-navigations__btn"
          >
            {currentIndex === count - 1 ? "Finish" : "Next"}
          </NmpButton>
        </>
      )}

      {surveyStatus === statusConstants.APPROVED && (
        <div className="approved-navigation">
          <div className="close-button">
            <NmpButton onClick={() => handleClose()} className="membercard-navigations__btn">
              Close
            </NmpButton>
          </div>

          {!!currentIndex && (
            <NmpButton
              type="nmp-ghost"
              icon={<LeftOutlined />}
              onClick={handleSwitchToPreviousQuestion}
              className="membercard-navigations__btn"
            >
              Back
            </NmpButton>
          )}

          <NmpButton
            type="nmp-primary"
            icon={currentIndex === count ? null : <RightOutlined />}
            iconRight
            onClick={handleAnswerSubmit}
            className="membercard-navigations__btn"
          >
            {currentIndex === count ? "Finish" : "Next"}
          </NmpButton>
        </div>
      )}
    </div>
  );
};

export default MemberSurveyNavigations;
