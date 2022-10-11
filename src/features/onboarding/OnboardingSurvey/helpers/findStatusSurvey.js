import { Status } from "../constants/statusConstants";

//const surveyStatus = finished_at ? "notStarted" : started_at ? "started" : "notStarted";
const findStatusSurvey = (started_at, finished_at, graded_at, isRecentlySubmitted) => {
  let result = "";
  switch (true) {
    case Boolean(graded_at) === true:
      result = Status.APPROVED;
      break;
    case Boolean(finished_at && isRecentlySubmitted) === true:
      result = Status.RECENT;
      break;
    case Boolean(finished_at && !isRecentlySubmitted) === true:
      result = Status.SUBMITTED;
      break;
    case Boolean(!finished_at && started_at) === true:
      result = Status.STARTED;
      break;
    case Boolean(!finished_at && !started_at) === true:
      result = Status.NOT_STARTED;
      break;
    default:
      result = Status.NO_STATUS;
  }
  return result;
};

export { findStatusSurvey };
