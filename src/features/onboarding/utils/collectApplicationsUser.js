import _ from "lodash";

export const collectApplicationsUser = (forms, surveys) => {
  // Onboardings and surveys may have Id collisions, we add tabId property to prevent bugs
  const formsMark = forms.map((application) => {
    return {
      ...application,
      tabId: `${application.id} onboarding`,
    };
  });
  const surveyMark = surveys.map((survey) => {
    return {
      ...survey,
      tabId: `${survey.id} survey`,
    };
  });

  let userApplications = [...formsMark, ...surveyMark];

  // let userApplications = [...forms, ...surveys].map((application) => {
  //     return {
  //         ...application,
  //         tabId: `${application.id} ${application.d_form ? "onboarding" : "survey"}`,
  //     };
  // });

  userApplications = _.sortBy(userApplications, (application) => {
    return application.order;
  });

  return userApplications;
};
