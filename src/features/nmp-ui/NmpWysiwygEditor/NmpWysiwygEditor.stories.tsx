import React from "react";

import { NmpWysiwygEditor } from "./NmpWysiwygEditor";

export default {
  title: "Nmp/WysiwygEditor",
  component: NmpWysiwygEditor,
};

const Template = (props) => {
  return <NmpWysiwygEditor {...props} />;
};

export const Base = Template.bind({});
Base.args = {
  // value: "<b>Bold</b>",
};
