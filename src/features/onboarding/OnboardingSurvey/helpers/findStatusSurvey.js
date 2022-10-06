import { StatusConstant } from "../constants/statusConstants";

//const surveyStatus = finished_at ? "notStarted" : started_at ? "started" : "notStarted";
const findStatusSurvey = (started_at, finished_at, graded_at, isRecentlySubmitted) => {
  let result = "";
  switch (true) {
    case Boolean(graded_at) === true:
      result = StatusConstant.APPROVED;
      break;
    case Boolean(finished_at && isRecentlySubmitted) === true:
      result = StatusConstant.RECENT;
      break;
    case Boolean(finished_at && !isRecentlySubmitted) === true:
      result = StatusConstant.SUBMITTED;
      break;
    case Boolean(!finished_at && started_at) === true:
      result = StatusConstant.STARTED;
      break;
    case Boolean(!finished_at && !started_at) === true:
      result = StatusConstant.NOT_STARTED;
      break;
    default:
      result = StatusConstant.NO_STATUS;
  }
  return result;
};

export { findStatusSurvey };
