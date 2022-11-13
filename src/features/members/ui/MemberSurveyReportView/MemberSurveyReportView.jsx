import "./styles.scss";

import React from "react";
import moment from "moment";

import { NmpButton, NmpCard } from "features/nmp-ui";

const MemberSurveyReportView = ({ data, isSurveyPassed, totalTime, isShowResult, setIsFeedbackView }) => {
  return (
    <div className="membercard-approved">
      <NmpCard>
        <div className="cardApproved">
          <div className="cardApproved_title">
            <div className="cardApproved_title_name">Your survey report</div>
            <div className="cardApproved_title_data">Graded {moment(data).format("DD/MM/YYYY [at] HH:ss")}</div>
          </div>
          <div className="cardApproved_report">
            <div className="report-status">
              <div
                className="report-status_circle"
                style={
                  isSurveyPassed
                    ? { borderColor: "#7367F0", color: "#7367F0" }
                    : { borderColor: "#C70000", color: "#C70000" }
                }
              >
                <span>{isSurveyPassed ? "Pass" : "FAIL"}</span>
              </div>
              <div className="report-status_subtitle">Total Score</div>
            </div>
            <div className="report-data">
              <div className="report-data_circle" style={{ borderColor: "#7367F0", color: "#7367F0" }}>
                <span>{totalTime}</span>
              </div>
              <div className="report-data_subtitle">Total time</div>
            </div>
          </div>
          <div className="cardApproved_feedback">
            {isShowResult && (
              <NmpButton type="nmp-primary" onClick={() => setIsFeedbackView(true)} style={{ width: 170 }}>
                View feedback
              </NmpButton>
            )}
          </div>
        </div>
      </NmpCard>
    </div>
  );
};

export default MemberSurveyReportView;
