import React from "react";

import "./styles.scss";

const OnboardingSurveyProgressBar = ({ progressPercents = 0 }) => {
  let progressPercentsWithMask = progressPercents;

  if (progressPercentsWithMask < 50) {
    // Prevent percentages to be 0 when there are at least 1 answered question
    progressPercentsWithMask = Math.ceil(progressPercentsWithMask);
  } else {
    // Prevent percentages to be 100 when there are still some questions left
    progressPercentsWithMask = Math.floor(progressPercentsWithMask);
  }

  return (
    <div className="onboarding-progress-bar">
      <div className="onboarding-progress-bar_filler" style={{ width: `${progressPercents}%` }}>
        <div
          className={`
            onboarding-progress-bar_percentages
            ${progressPercents < 55 ? "display-on-right" : "display-on-left"}
          `}
        >
          {progressPercentsWithMask}%
        </div>
      </div>
    </div>
  );
};

export default OnboardingSurveyProgressBar;
