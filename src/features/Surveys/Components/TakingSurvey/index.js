import React from "react";

import { useGetAllSurveyQuestionsQuery, useSurveyByIdQuery } from "api/Onboarding/prospectUserQuery";

// import StepperSurveyComponent from "../../../onboarding/OnboardingSurvey/view/StepperSurveyView";
// import SurveyGradedComponent from "./components/SurveyGradedComponent";
// import SurveyFinishComponent from "./components/SurveyFinishComponent";

const getSurveySubmitStatus = (survey, isSubmited) => {
  const status =
    (survey.graded_at && "approved") ||
    (survey.finished_at && isSubmited && "recent") ||
    (survey.finished_at && !isSubmited && "submitted") ||
    "";
  return status;
};

const [APPROVED, RECENT, SUBMITTED, STARTED, NOT_STARTED, NO_STATUS] = [
  "approved",
  "recent",
  "submitted",
  "started",
  "notStarted",
  "no status",
];

const findStatusSurvey = (started_at, finished_at, graded_at, isRecentlySubmitted) => {
  switch (true) {
    case graded_at:
      return APPROVED;
    case finished_at && isRecentlySubmitted:
      return RECENT;
    case finished_at && !isRecentlySubmitted:
      return SUBMITTED;
    case !finished_at && started_at:
      return STARTED;
    case !finished_at:
      return NOT_STARTED;
    default:
      return NO_STATUS;
  }
};

const TakingSurvey = ({ selectedSurveyId, isRecentlySubmitted }) => {
  //const surveyStatus = finished_at ? "notStarted" : started_at ? "started" : "notStarted";
  //const submittedSurveyStatus = getSurveySubmitStatus(survey, isRecentlySubmitted);

  console.log("selectedSurveyId", selectedSurveyId);
  const { data: survey, isLoading: isLoadingSurvey } = useSurveyByIdQuery(
    { id: selectedSurveyId },
    { enabled: !!selectedSurveyId }
  );

  const { started_at, finished_at, graded_at } = survey || {};

  const statusSurvey = findStatusSurvey(started_at, finished_at, graded_at, isRecentlySubmitted);
  console.log("statusSurvey", statusSurvey);

  // if (statusSurvey === "approved") {
  //   return (
  //     <>
  //       <SurveyGradedComponent />
  //     </>
  //   );
  // }
  // if (statusSurvey === "submitted" || statusSurvey === "recent") {
  //   return (
  //     <>
  //       <SurveyFinishComponent />
  //     </>
  //   );
  // }
  // if (statusSurvey === "started") {
  //   return (
  //     <>
  //       <StepperSurveyComponent />
  //     </>
  //   );
  // }
};

export default TakingSurvey;
