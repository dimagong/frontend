import _ from "lodash";

export const OnboardingsTypes = {
  DForm: "form",
  Survey: "survey",
};

export const collectApplicationsUser = (forms, surveys) => {
  // Onboardings and surveys may have ID collisions, we add tabId property to prevent bugs
  const formsMark = forms.map((form) => {
    return {
      ...form,
      type: OnboardingsTypes.DForm,
    };
  });
  const surveyMark = surveys.map((survey) => {
    return {
      ...survey,
      type: OnboardingsTypes.Survey,
    };
  });

  let userApplications = [...formsMark, ...surveyMark];

  userApplications = _.sortBy(userApplications, (application) => {
    return application.order;
  });

  return userApplications;
};
