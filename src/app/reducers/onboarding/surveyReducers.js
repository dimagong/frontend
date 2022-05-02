const setSurveyTriggers = (state, { payload }) => {
  state.survey.triggers = payload;
};

export default {
  setSurveyTriggers,
};
