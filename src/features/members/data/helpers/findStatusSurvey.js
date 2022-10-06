import { StatusConstants } from "./../constants/statusConstants";

const findStatusSurvey = (started_at, finished_at, graded_at, isRecentlySubmitted) => {
  let result = "";
  switch (true) {
    case Boolean(graded_at) === true:
      result = StatusConstants.APPROVED;
      break;
    case Boolean(finished_at && isRecentlySubmitted) === true:
      result = StatusConstants.RECENT;
      break;
    case Boolean(finished_at && !isRecentlySubmitted) === true:
      result = StatusConstants.SUBMITTED;
      break;
    case Boolean(!finished_at && started_at) === true:
      result = StatusConstants.STARTED;
      break;
    case Boolean(!finished_at && !started_at) === true:
      result = StatusConstants.NOT_STARTED;
      break;
    default:
      result = StatusConstants.NO_STATUS;
  }
  return result;
};

export { findStatusSurvey };
