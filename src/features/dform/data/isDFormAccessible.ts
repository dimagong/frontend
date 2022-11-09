import { unexpected } from "features/common";

import { DformAccessTypes } from "../types";

const unexpectedAccessTypeMsg = "DForm access type.";

export const isMemberDFormAccessible = (accessType: DformAccessTypes): boolean => {
  switch (accessType) {
    case DformAccessTypes.UserLock:
    case DformAccessTypes.HardLock:
      return false;
    case DformAccessTypes.Allow:
    case DformAccessTypes.UserUnlock:
      return true;
    default:
      unexpected(unexpectedAccessTypeMsg);
  }
};

export const isManagerDFormAccessible = (accessType: DformAccessTypes) => {
  switch (accessType) {
    case DformAccessTypes.HardLock:
      return false;
    case DformAccessTypes.Allow:
    case DformAccessTypes.UserLock:
    case DformAccessTypes.UserUnlock:
      return true;
    default:
      unexpected(unexpectedAccessTypeMsg);
  }
};

export const isDFormAccessible = (accessType: DformAccessTypes, isMemberView: boolean) => {
  return (isMemberView ? isMemberDFormAccessible : isManagerDFormAccessible)(accessType);
};
