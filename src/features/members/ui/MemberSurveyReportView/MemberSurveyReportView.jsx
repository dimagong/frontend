import "./styles.scss";

import React from "react";
import moment from "moment";

import NpmCard from "../../../nmp-ui/NpmCard";
import NpmButton from "../../../nmp-ui/NpmButton";

const membercardApprovedStyle = {
  maxHeight: "630px",
  maxWidth: "618px",
  width: "70vw",
  padding: "36px 28px",
};

const MemberSurveyReportView = ({ data, isSurveyPassed, totalTime, isShowResult, setIsFeedbackView }) => {
  return (
    <div className="membercard-approved">
      <NpmCard style={{ height: "600px", maxWidth: "600px", width: "57vw" }}>
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
                    ? { borderColor: "#00BF00", color: "#00BF00" }
                    : { borderColor: "#d33c30", color: "#d33c30" }
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
              <NpmButton onClick={() => setIsFeedbackView(true)} style={{ width: 170 }}>
                <span>View feedback</span>
              </NpmButton>
            )}
          </div>
        </div>
      </NpmCard>
    </div>
  );
};

export default MemberSurveyReportView;
