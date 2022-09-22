import React from "react";

import { NpmMenu } from "./../../nmp-ui";

import { findStatusSurvey } from "./../data/helpers/findStatusSurvey";

const MemberMenuView = ({ dForms, surveys, setActiveAppOnboarding }) => {
  const selectMenuOption = (selectedOption) => {
    if (selectedOption.includes("applications")) {
      const selectedDForm = dForms.find((el) => el.id === +selectedOption[0]);
      setActiveAppOnboarding({ ...selectedDForm, type: "dform" });
    } else if (selectedOption.includes("surveys")) {
      const selectedSurvey = surveys.find((el) => el.id === +selectedOption[0]);
      setActiveAppOnboarding({ ...selectedSurvey, type: "survey" });
    }
  };

  const contentDForms = dForms.map((form) => {
    return { title: form.name, status: form.status ?? "no-status", id: form.id, type: "dform" };
  });

  const contentSurveys = surveys.map((survey) => {
    const status = findStatusSurvey(survey.started_at, survey.finished_at, survey.graded_at, null);
    return { title: survey.title, status, id: survey.id, type: "survey" };
  });

  return (
    <NpmMenu
      groupItems={[{ applications: contentDForms }, { surveys: contentSurveys }]}
      selectOption={selectMenuOption}
    />
  );
};

export default MemberMenuView;
