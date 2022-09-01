import React from "react";

import moment from "moment";

const SurveyStatusTopbar = ({ time }) => {
  return (
    <span className="onboarding_survey_result-grade_time">Graded {moment(time).format("DD/MM/YYYY [at] HH:ss")}</span>
  );
};

export default SurveyStatusTopbar;
