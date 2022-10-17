import "./styles.scss";

import React from "react";
import { RightOutlined, LeftOutlined } from "@ant-design/icons";

import { NpmButton } from "features/nmp-ui";

import { Status } from "features/members/data/constants/statusConstants";

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
      {surveyStatus === Status.NOT_STARTED && (
        <NpmButton
          type="nmp-primary"
          icon={<RightOutlined />}
          iconRight
          onClick={handleSurveyStart}
          className="membercard-navigations__btn"
        >
          Begin
        </NpmButton>
      )}
      {surveyStatus === Status.STARTED && (
        <>
          {!!currentIndex && (
            <NpmButton
              type="nmp-ghost"
              icon={<LeftOutlined />}
              onClick={handleSwitchToPreviousQuestion}
              className="membercard-navigations__btn"
            >
              Back
            </NpmButton>
          )}

          <NpmButton
            type="nmp-primary"
            icon={currentIndex === count - 1 ? null : <RightOutlined />}
            iconRight
            onClick={handleAnswerSubmit}
            className="membercard-navigations__btn"
          >
            {currentIndex === count - 1 ? "Finish" : "Next"}
          </NpmButton>
        </>
      )}

      {surveyStatus === Status.APPROVED && (
        <div className="approved-navigation">
          <div className="close-button">
            <NpmButton onClick={() => handleClose()} className="membercard-navigations__btn">
              Close
            </NpmButton>
          </div>

          {!!currentIndex && (
            <NpmButton
              type="nmp-ghost"
              icon={<LeftOutlined />}
              onClick={handleSwitchToPreviousQuestion}
              className="membercard-navigations__btn"
            >
              Back
            </NpmButton>
          )}

          <NpmButton
            type="nmp-primary"
            icon={currentIndex === count ? null : <RightOutlined />}
            iconRight
            onClick={handleAnswerSubmit}
            className="membercard-navigations__btn"
          >
            {currentIndex === count ? "Finish" : "Next"}
          </NpmButton>
        </div>
      )}
    </div>
  );
};

export default MemberSurveyNavigations;
