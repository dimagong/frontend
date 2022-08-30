import React from "react";

import { Spinner } from "reactstrap";

const SurveyStatusSection = ({ isSurveyStatsLoading, isSurveyPassed, surveyStats }) => {
  return (
    <div className={`onboarding_survey_result-stats ${isSurveyStatsLoading ? "stats-loading" : ""}`}>
      <div className="onboarding_survey_result-stats_stat">
        <div
          className="onboarding_survey_result-stats_stat_value"
          style={
            isSurveyPassed ? { borderColor: "#00BF00", color: "#00BF00" } : { borderColor: "#d33c30", color: "#d33c30" }
          }
        >
          {(surveyStats && !isSurveyStatsLoading && (isSurveyPassed ? "Pass" : "FAIL")) || (
            <Spinner style={{ fontSize: "18px" }} size={22} color={"primary"} />
          )}
        </div>
        <div className="onboarding_survey_result-stats_stat_label">Total Score</div>
      </div>

      <div className="onboarding_survey_result-stats_stat">
        <div className="onboarding_survey_result-stats_stat_value" style={{ borderColor: "#7367F0", color: "#7367F0" }}>
          {(surveyStats && `${surveyStats.totalTime}`) || (
            <Spinner style={{ fontSize: "18px" }} size={22} color={"primary"} />
          )}
        </div>
        <div className="onboarding_survey_result-stats_stat_label">Total Time</div>
      </div>
    </div>
  );
};

export default SurveyStatusSection;
