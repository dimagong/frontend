import { statusConstants } from "./../constants/statusConstants";

//const surveyStatus = finished_at ? "notStarted" : started_at ? "started" : "notStarted";
const findStatusSurvey = (started_at, finished_at, graded_at, isRecentlySubmitted) => {
  let result = "";
  switch (true) {
    case Boolean(graded_at) === true:
      result = statusConstants.APPROVED;
      break;
    case Boolean(finished_at && isRecentlySubmitted) === true:
      result = statusConstants.RECENT;
      break;
    case Boolean(finished_at && !isRecentlySubmitted) === true:
      result = statusConstants.SUBMITTED;
      break;
    case Boolean(!finished_at && started_at) === true:
      result = statusConstants.STARTED;
      break;
    case Boolean(!finished_at && !started_at) === true:
      result = statusConstants.NOT_STARTED;
      break;
    default:
      result = statusConstants.NO_STATUS;
  }
  return result;
};

export { findStatusSurvey };
