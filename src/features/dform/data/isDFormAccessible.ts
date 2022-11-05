import { DFormAccessTypes } from "../types";

export const isMemberDFormAccessible = (accessType: DFormAccessTypes) => {
  switch (accessType) {
    case DFormAccessTypes.UserLock:
    case DFormAccessTypes.HardLock:
      return false;
    case DFormAccessTypes.Allow:
    case DFormAccessTypes.UserUnlock:
      return true;
    default:
      throw new Error(`Unexpected: DForm access type "${accessType}".`);
  }
};

export const isManagerDFormAccessible = (accessType: DFormAccessTypes) => {
  switch (accessType) {
    case DFormAccessTypes.HardLock:
      return false;
    case DFormAccessTypes.Allow:
    case DFormAccessTypes.UserLock:
    case DFormAccessTypes.UserUnlock:
      return true;
    default:
      throw new Error(`Unexpected: DForm access type "${accessType}".`);
  }
};

export const isDFormAccessible = (accessType: DFormAccessTypes, isMemberView: boolean) => {
  return (isMemberView ? isMemberDFormAccessible : isManagerDFormAccessible)(accessType);
};
