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
