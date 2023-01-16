export const findActiveOnboarding = (applications) => {
  if (applications.length === 0) {
    return null;
  }

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
};

export const getInitialOnboarding = (profile, userApplications) => {
  if (!profile.onboarding?.id) {
    return findActiveOnboarding(userApplications);
  } else if (profile?.onboarding?.id) {
    return { ...profile.onboarding };
  }
};
