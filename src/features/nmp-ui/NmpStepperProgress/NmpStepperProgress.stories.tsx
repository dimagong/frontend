import React from "react";

import { NmpStepperProgress } from "./NmpStepperProgress";

export default {
  title: "Nmp/NmpStepperProgress",
  component: NmpStepperProgress,
};

const Template = (props) => <NmpStepperProgress {...props} />;

export const Base = Template.bind({});
Base.args = {
  steps: 10,
  current: 1,
};
