export const findActiveAppOnboarding = (applications) => {
  if (applications.length) {
    let activeOnboarding = applications.find((onboarding) => {
      if (onboarding.d_form) {
        return onboarding.d_form.status === "in-progress" || onboarding.d_form.status === "unsubmitted";
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
