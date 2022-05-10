import { clientAPI } from "api/clientAPI";
import { useGenericMutation } from "api/useGenericMutation";

const SurveyShowResultsKey = "surveyShowResultsKey";

export const useSurveyShowResults = (surveyId, options = {}) => {
  return useGenericMutation({
    queryKey: [SurveyShowResultsKey, surveyId],
    mutationFn: (showResults) =>
      clientAPI.patch(`/api/survey-assigned-interaction/${surveyId}/show-result`, { is_show_result: showResults }),
    ...options,
  });
};
