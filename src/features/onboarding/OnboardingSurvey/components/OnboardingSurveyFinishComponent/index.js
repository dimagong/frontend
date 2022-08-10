import React, { useState } from "react";

import { useGetAllSurveyQuestionsQuery } from "api/Onboarding/prospectUserQuery";

import OnboardingSurveyFeedbackViewComponent from "./components/OnboardingSurveyFeedbackViewComponent";
import OnboardingSurveyStatusComponent from "./components/OnboardingSurveyStatusComponent";

//single responsibility  && interface segregation
const getSurveySubmitStatus = (survey, isSubmited) => {
  const status = (survey.graded_at && "approved") || (survey.finished_at && isSubmited && "recent") || "submitted";
  return status;
};

const OnboardingSurveyFinishComponent = ({ survey }) => {
  const [isFeedbackView, setIsFeedbackView] = useState(false);

  const { id, graded_at } = survey;

  const { data: surveyInteraction, isLoading: isSurveyGradedQuestionsLoading } = useGetAllSurveyQuestionsQuery(
    { id },
    { enabled: !!graded_at }
  );

  const isFeedbackExist = !!survey?.passedSurveyData?.answers.find((answer) => !!answer.feedback);

  const submittedSurveyStatus = getSurveySubmitStatus(selectedSurvey, isRecentlySubmitted);

  return graded_at && isFeedbackView ? (
    <OnboardingSurveyFeedbackViewComponent
      questions={surveyInteraction.questions}
      answers={surveyInteraction.answers}
      onFeedbackClose={() => setIsFeedbackView(false)}
      showResult={survey.is_show_result}
    />
  ) : (
    <div style={{ marginLeft: "-100px", marginRight: "100px" }}>
      <OnboardingSurveyStatusComponent
        survey={survey}
        isFeedbackExist={isFeedbackExist}
        isLoading={isSurveyGradedQuestionsLoading}
        onForceApplicationShow={setIsFeedbackView}
        status={submittedSurveyStatus}
        isAllApplicationsCompleted={isAllApplicationsCompleted}
      />
    </div>
  );
};

export default OnboardingSurveyFinishComponent;
