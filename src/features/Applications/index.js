import React from "react";
import { useSelector } from "react-redux";

import { selectdForm } from "app/selectors";

import { Application } from "./Application";

const Applications = ({ isCreate }) => {
  const selectedDForm = useSelector(selectdForm);

  return <Application isCreate={isCreate} applicationId={selectedDForm?.id} key={selectedDForm?.id ?? "create"} />;
};

export default Applications;
