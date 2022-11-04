import React from "react";
import { useSelector } from "react-redux";

import { selectdForm } from "app/selectors";

import { ApplicationPage } from "./ApplicationPage";

export const ApplicationsPage = () => {
  const selectedDForm = useSelector(selectdForm);

  return selectedDForm ? <ApplicationPage applicationId={selectedDForm.id} key={selectedDForm.id} /> : null;
};
