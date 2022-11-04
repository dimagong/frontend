export enum AccessTypes {
  Allow = "allow",
  HardLock = "hard-lock",
  UserLock = "user-lock",
  UserUnlock = "user-unlock",
}

export const isMemberViewDFormAccessible = (accessType = AccessTypes.HardLock) => {
  switch (accessType) {
    case AccessTypes.UserLock:
    case AccessTypes.HardLock:
      return false;
    case AccessTypes.Allow:
    case AccessTypes.UserUnlock:
      return true;
    default:
      throw new Error(`Unexpected accessType "${accessType}".`);
  }
};

export const isManagerViewDFormAccessible = (accessType = AccessTypes.HardLock) => {
  switch (accessType) {
    case AccessTypes.HardLock:
      return false;
    case AccessTypes.Allow:
    case AccessTypes.UserLock:
    case AccessTypes.UserUnlock:
      return true;
    default:
      throw new Error(`Unexpected accessType "${accessType}".`);
  }
};
