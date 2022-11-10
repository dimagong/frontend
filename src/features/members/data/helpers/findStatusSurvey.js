import { Status } from "features/members/data/constants/statusConstants";

const findStatusSurvey = (startedAt, finishedAt, gradedAt, isRecentlySubmitted = false) => {
  let result = "";
  switch (true) {
    case Boolean(gradedAt) === true:
      result = Status.APPROVED;
      break;
    case Boolean(finishedAt && isRecentlySubmitted) === true:
      result = Status.RECENT;
      break;
    case Boolean(finishedAt && !isRecentlySubmitted) === true:
      result = Status.SUBMITTED;
      break;
    case Boolean(!finishedAt && startedAt) === true:
      result = Status.STARTED;
      break;
    case Boolean(!finishedAt && !startedAt) === true:
      result = Status.NOT_STARTED;
      break;
    default:
      result = Status.NO_STATUS;
  }
  return result;
};

export { findStatusSurvey };
