const getSurveySubmitStatus = (survey, isSubmited) => {
  const status =
    (survey.graded_at && "approved") ||
    (survey.finished_at && isSubmited && "recent") ||
    (survey.finished_at && !isSubmited && "submitted") ||
    "";
  return status;
};

export { getSurveySubmitStatus };
