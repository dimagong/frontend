import { statusConstant } from "../constants/statusConstants";

//const surveyStatus = finished_at ? "notStarted" : started_at ? "started" : "notStarted";
const findStatusSurvey = (started_at, finished_at, graded_at, isRecentlySubmitted) => {
  let result = "";
  switch (true) {
    case Boolean(graded_at) === true:
      result = statusConstant.APPROVED;
      break;
    case Boolean(finished_at && isRecentlySubmitted) === true:
      result = statusConstant.RECENT;
      break;
    case Boolean(finished_at && !isRecentlySubmitted) === true:
      result = statusConstant.SUBMITTED;
      break;
    case Boolean(!finished_at && started_at) === true:
      result = statusConstant.STARTED;
      break;
    case Boolean(!finished_at && !started_at) === true:
      result = statusConstant.NOT_STARTED;
      break;
    default:
      result = statusConstant.NO_STATUS;
  }
  return result;
};

export { findStatusSurvey };
