import _ from "lodash";

export const collectApplicationsUser = (forms, surveys) => {
  // Onboardings and surveys may have Id collisions, we add tabId property to prevent bugs
  let userApplications = [...forms, ...surveys].map((application) => {
    return {
      ...application,
      tabId: `${application.id} ${application.d_form ? "onboarding" : "survey"}`,
    };
  });

  userApplications = _.sortBy(userApplications, (application) => {
    return application.order;
  });

  return userApplications;
};
