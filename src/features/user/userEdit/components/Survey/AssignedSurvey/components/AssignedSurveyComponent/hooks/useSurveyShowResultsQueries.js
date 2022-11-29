import { toast } from "react-toastify";

import { useGenericMutation } from "api/useGenericMutation";
import { useGenericQuery } from "api/useGenericQuery";

import { camelize } from "utility/camelize";

const SurveyShowResultsKey = "surveyShowResultsKey";

const SurveyShowResultsKeys = {
  all: () => [SurveyShowResultsKey],
  byUserIdAndSurveyId: (userId, surveyId) => [...SurveyShowResultsKeys.all(), { userId, surveyId }],
};

export const useSurveyShowResultMutation = (userId, surveyId) => {
  return useGenericMutation(
    {
      url: `/api/survey-assigned-interaction/${surveyId}/show-result`,
      method: "patch",
      queryKey: SurveyShowResultsKeys.byUserIdAndSurveyId(userId, surveyId),
      transformData: (isShowResult) => {
        return { is_show_result: isShowResult };
      },
    },
    {
      onSuccess: () => {
        toast.success("Show result changed");
      },
    }
  );
};

export const useSurveyByUserIdAndSurveyIdQuery = (userId, surveyId) => {
  return useGenericQuery(
    {
      url: `/api/survey-assigned-interaction/${userId}`,
      queryKey: SurveyShowResultsKeys.byUserIdAndSurveyId(userId, surveyId),
    },
    {
      select: (surveys) => {
        return surveys.map((survey) => camelize(survey));
      },
    }
  );
};
