export const findActiveAppOnboarding = (applications) => {
  if (applications.length) {
    let activeOnboarding = applications.find((onboarding) => {
      if (onboarding.type === "dform") {
        return onboarding.status === "in-progress" || onboarding.status === "unsubmitted";
      } else {
        return !onboarding.finished_at;
      }
    });
    if (!activeOnboarding) {
      activeOnboarding = applications[0];
    }
    return activeOnboarding;
  }
  return false;
};

export const initialAppOnboarding = (profile, userApplications) => {
  let appOnboardingInitial = [];

  if (profile && !profile.onboarding?.id) {
    appOnboardingInitial = findActiveAppOnboarding(userApplications) ?? [];
  } else if (profile?.onboarding?.id) {
    appOnboardingInitial = { ...profile.onboarding };
  }
  return appOnboardingInitial;
};
