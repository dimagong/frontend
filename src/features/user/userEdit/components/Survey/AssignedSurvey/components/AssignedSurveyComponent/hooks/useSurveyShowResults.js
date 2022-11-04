import { clientAPI } from "api/clientAPI";
import { useGenericMutationDeprecated } from "api/useGenericMutation";

const SurveyShowResultsKey = "surveyShowResultsKey";

export const useSurveyShowResults = (surveyId, options = {}) => {
  return useGenericMutationDeprecated({
    queryKey: [SurveyShowResultsKey, surveyId],
    mutationFn: (showResults) =>
      clientAPI.patch(`/api/survey-assigned-interaction/${surveyId}/show-result`, { is_show_result: showResults }),
    ...options,
  });
};
