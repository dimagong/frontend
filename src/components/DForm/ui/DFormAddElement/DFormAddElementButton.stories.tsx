import React from "react";

import { DFormAddElementButton } from "./DFormAddElementButton";

export default {
  title: "DForm/AddElementButton",
  component: DFormAddElementButton,
};

const Template = (props) => {
  return <DFormAddElementButton elementName={props.elementName} />;
};

export const Base = Template.bind({});
Base.args = {
  elementName: "Add new element",
};
