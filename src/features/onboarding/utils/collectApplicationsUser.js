import _ from "lodash";

export const collectApplicationsUser = (forms, surveys) => {
  // Onboardings and surveys may have ID collisions, we add tabId property to prevent bugs
  const formsMark = forms.map((form) => {
    return {
      ...form,
      type: "dform",
      //tabId: `${form.id} form`,
    };
  });
  const surveyMark = surveys.map((survey) => {
    return {
      ...survey,
      type: "survey",
      // tabId: `${survey.id} survey`,
    };
  });

  let userApplications = [...formsMark, ...surveyMark];

  userApplications = _.sortBy(userApplications, (application) => {
    return application.order;
  });

  return userApplications;
};
